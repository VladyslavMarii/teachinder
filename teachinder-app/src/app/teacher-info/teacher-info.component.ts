import { Component, Inject, Input, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { User } from '../data/user.interface';


@Component({
  selector: 'app-teacher-info',
  standalone: true,
  imports: [ MatDialogModule,
    MatButtonModule,],
  templateUrl: './teacher-info.component.html',
  styleUrl: './teacher-info.component.scss'
})
export class TeacherInfoComponent {
  user: User | undefined; 

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: User) {
    if (data) {
      this.user = data;
    } else {
      // Handle the case where user data is not provided
      console.error('User data is undefined');
    }
  }  

  toggleStar(): void {
    this.user!.favorite=!this.user!.favorite;
  }
}
