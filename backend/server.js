const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2/promise"); // mysql2/promise for async/await support
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files
// app.use('/uploads', express.static('uploads'));

// Create a MySQL connection
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Subru@123123123", // Ensure you are using correct credentials
      database: "event_management",
    });
    console.log("Connected to MySQL Database!");
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  }
})();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// API to create an event
// app.post("/events", upload.single("image"), async (req, res) => {
//   const { eventName, eventDate } = req.body;
//   const image = req.file ? req.file.filename : null;

//   console.log("Received eventDate:", eventDate);

//   const formattedDate = new Date(eventDate)
//     .toISOString()
//     .slice(0, 19)
//     .replace("T", " ");

//   try {
//     const [result] = await db.execute(
//       "INSERT INTO event (event_name, event_date, image) VALUES (?, ?, ?)",
//       [eventName, formattedDate, image]
//     );
//     console.log("Full Result:", result); // Log the entire result

//     if (result && result.insertId) {
//       res.status(201).json({
//         message: "Event created successfully",
//         id: result.insertId,
//       });
//     } else {
//       throw new Error("Unexpected result structure");
//     }
//   } catch (error) {
//     console.error("Error during event creation:", error);
//     res.status(500).json({ error: "Database error", details: error.message });
//   }
// });
// app.post("/events", upload.array("files", 10), async (req, res) => {
//   const { eventName, eventDate } = req.body;
//   const files = req.files.map((file) => file.filename); // Store filenames
//   console.log("files", files);
//   const formattedDate = new Date(eventDate)
//     .toISOString()
//     .slice(0, 19)
//     .replace("T", " ");

//   try {
//     const [result] = await db.execute(
//       "INSERT INTO event (event_name, event_date, image) VALUES (?, ?, ?)",
//       [eventName, formattedDate, files.join(", ")] // Join file names into a string
//     );
//     console.log(result);
//     if (result && result.insertId) {
//       res.status(201).json({
//         message: "Event created successfully",
//         id: result.insertId,
//       });
//     } else {
//       throw new Error("Unexpected result structure");
//     }
//   } catch (error) {
//     console.error("Error during event creation:", error);
//     res.status(500).json({ error: "Database error", details: error.message });
//   }
// });
app.post("/events", upload.array("files", 10), async (req, res) => {
  const { eventName, eventDate } = req.body;

  const files = req.files.map((file) =>
    file.originalname.replace(/["\[\]]/g, "")
  );
  // const files = req.files.originalname;

  console.log("files", files);

  const formattedDate = new Date(eventDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    const [result] = await db.execute(
      "INSERT INTO event (event_name, event_date, image) VALUES (?, ?, ?)",
      [eventName, formattedDate, files.join(", ")] // Store files as JSON string
    );
    console.log(result);
    if (result && result.insertId) {
      res.status(201).json({
        message: "Event created successfully",
        id: result.insertId,
      });
    } else {
      throw new Error("Unexpected result structure");
    }
  } catch (error) {
    console.error("Error during event creation:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    // Execute the query to fetch all events from the 'event' table
    const [results] = await db.execute("SELECT * FROM event");

    // Send the results as JSON response
    res.setHeader("Content-Type", "application/json"); // Ensure correct Content-Type
    res.json(results); // Send the fetched event data as the response
  } catch (error) {
    console.error("Error fetching events from database:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Return a 500 status if there’s an error
  }
});

// API to update an event
app.put("/events/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { eventName, eventDate } = req.body;
  const image = req.file ? req.file.filename : null;

  // Convert the eventDate to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
  const formattedDate = new Date(eventDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  let query = "UPDATE event SET event_name = ?, event_date = ?";
  const params = [eventName, formattedDate];

  if (image) {
    query += ", image = ?";
    params.push(image);
  }

  query += " WHERE id = ?";
  params.push(id);

  try {
    await db.execute(query, params);
    res.status(200).json({ message: "Event updated successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// API to delete an event
app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM event WHERE id = ?";
  try {
    await db.execute(query, [id]);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
