import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [ MatDialogModule,
    MatButtonModule, FormsModule,
    ReactiveFormsModule],
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss'
})
export class AddTeacherComponent {
  @Output() addUser = new EventEmitter<any>(); // Event emitter to pass form data to parent component

  constructor(public dialogRef: MatDialogRef<AddTeacherComponent>, private http: HttpClient) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      console.log("invalid form submission")
      return;
    }

    const formData = form.value;

    // Emit the form data to the parent component
    this.addUser.emit(formData);

    // Close the dialog
    this.dialogRef.close();
  }

  onClose(): void {
    // Close the dialog
    this.dialogRef.close();
  }

}
