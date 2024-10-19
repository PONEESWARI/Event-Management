import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngModel

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,       // Add MatButtonModule here
    MatFormFieldModule,   // Add MatFormFieldModule here
    MatInputModule,
    MatDialogModule,
    FormsModule   // Add MatInputModule here
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'] // Corrected to styleUrls (plural)
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventName: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without returning data
  }

  onSubmit(): void {
    console.log("this.data.eventName",this.data.eventName);
    this.dialogRef.close(this.data.eventName); // Return the new event name
  }
}
