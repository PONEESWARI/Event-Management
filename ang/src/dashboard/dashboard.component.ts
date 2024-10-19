import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EventService } from '../service/event.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['select', 'event_name', 'event_date', 'image', 'actions'];
  selection = new SelectionModel<any>(true, []); // Allow multi-selection

  constructor(private eventService: EventService,public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    fetch('http://localhost:3000/api/events')
      .then(response => response.json())
      .then(data => {
        if (data && data.events) {
          this.dataSource.data = data.events;
        } else {
          this.dataSource.data = data;
        }
        console.log(this.dataSource.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }

  // Export selected events to CSV
  exportToCSV() {
    const selectedEvents = this.selection.selected;
    if (selectedEvents.length === 0) {
      console.log('No events selected for export');
      return;
    }

    const csvData = this.convertToCSV(selectedEvents);
    this.downloadCSV(csvData, 'events.csv');
  }

  // Convert the selected events to CSV format
  convertToCSV(events: any[]) {
    const header = ['Event Name', 'Event Date', 'Image'];
    const rows = events.map(event => [
      event.event_name,
         new Date(event.event_date).toLocaleDateString('en-US', {
      // year: 'numeric',
      month: 'short',
      day: 'numeric'
    }), //
      event.image
    ]);

    return [header, ...rows].map(row => row.join(',')).join('\n');
  }

  

  // Download the CSV file
  downloadCSV(csvData: string, filename: string) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // Check if a specific event is selected
 // Function to toggle all selection
 toggleAllSelection() {
  if (this.isAllSelected()) {
    this.selection.clear(); // Clear selection if all are selected
  } else {
    this.dataSource.data.forEach(row => this.selection.select(row)); // Select all
  }
}

// Function to check if all items are selected
isAllSelected() {
  const numSelected = this.selection.selected.length; // Get the count of selected items
  const numRows = this.dataSource.data.length; // Get the total number of rows
  return numSelected === numRows; // Return true if all are selected
}

// Method to check if a specific event is selected
isSelected(event: any) {
  return this.selection.isSelected(event); // Check if the event is selected
}

getFileName(filePath: string): string {
  return filePath.split('/').pop() || ''; // Extract the filename from the URL
}


  editEvent(event: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: { eventName: event.event_name }, // Pass the current event name to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedEventData = {
          eventName: result,
          eventDate: new Date().toISOString(), // Keep the original date
        };
  
        this.eventService.updateEvent(event.id, updatedEventData).subscribe({
          next: () => {
            console.log('Event updated successfully');
            this.fetchEvents(); // Refresh the events list
          },
          error: err => {
            console.error('Error updating event:', err);
          },
          complete: () => {
            console.log('Update complete');
          },
        });
      }
    });
  }

  deleteEvent(event: any) {
    const id = event.id; // Get the ID of the event to be deleted
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        console.log('Event deleted successfully');
        this.fetchEvents(); // Refresh the events list
      },
      error: err => {
        console.error('Error deleting event:', err);
      },
      complete: () => {
        console.log('Delete complete');
      },
    });
  }
}
