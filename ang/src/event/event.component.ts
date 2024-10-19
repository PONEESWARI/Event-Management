// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core'; 
// import { MatButtonModule } from '@angular/material/button';
// import { EventService } from '../service/event.service'; 


// @Component({
//   selector: 'app-event',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatButtonModule
//   ],
//   templateUrl: './event.component.html',
//   styleUrls: ['./event.component.scss'], // Fixed typo here
// })
// export class EventComponent {
//   eventForm: FormGroup;
//   selectedImage: File | null = null;

//   constructor(private fb: FormBuilder,private eventService: EventService) {
//     this.eventForm = this.fb.group({
//       eventName: ['', Validators.required],
//       eventDate: ['', Validators.required],
//     });
//   }

//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files?.length) {
//       this.selectedImage = input.files[0];
//     }
//   }

//   onSubmit(): void {
//     if (this.eventForm.valid) {
//       const eventData = {
//         ...this.eventForm.value,
//       eventDate: this.eventForm.value.eventDate.toISOString(),
//       image: this.selectedImage,
//       };
      
//       this.eventService.createEvent(eventData).subscribe({
//         next: (response) => {
//           console.log('Event created successfully:', response);
//           // Optionally, reset the form or show a success message
//           this.eventForm.reset();
//           this.selectedImage = null;
//         },
//         error: (error) => {
//           console.error('Error creating event:', error);
//         },
//       });
          
// }
//   }}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {
  eventForm: FormGroup;
  selectedFiles: File[] = []; // Store all selected files
  filePreviews: string[] = []; // Store preview URLs of files

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);

        // Create a preview URL for each file
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(input.files[i]);
      }
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        files: this.selectedFiles, // Send selected files to the service
      };

      this.eventService.createEvent(eventData).subscribe({
        next: (response) => {
          console.log('Event created successfully:', response);
          this.eventForm.reset();
          this.selectedFiles = [];
          this.filePreviews = [];
        },
        error: (error) => {
          console.error('Error creating event:', error);
        },
      });
    }
  }
}

