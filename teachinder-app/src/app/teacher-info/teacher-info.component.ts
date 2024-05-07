import { Component, Inject, Input, Optional,AfterViewInit  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { User } from '../data/user.interface';
import * as L from 'leaflet';;
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';

@Component({
  selector: 'app-teacher-info',
  standalone: true,
  imports: [ MatDialogModule,
    MatButtonModule,CommonModule],
  templateUrl: './teacher-info.component.html',
  styleUrl: './teacher-info.component.scss'
})
export class TeacherInfoComponent implements AfterViewInit{
  user: User | undefined; 
  private map: any;
  daysUntilNextBirthday: number | undefined;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: User) {
    if (data) {
      this.user = data;
      this.daysUntilNextBirthday = this.calculateDaysUntilNextBirthday(data.b_day); // Обчислення кількості днів до наступного дня народження

    } else {
      // Handle the case where user data is not provided
      console.error('User data is undefined');
    }
  }  
  private calculateDaysUntilNextBirthday(birthday: string): number {
    // Обчислення кількості днів до наступного дня народження
    const today = dayjs();
    let nextBirthday = dayjs(birthday).set('year', today.year());
    
    // Перевірка, чи дата народження вже пройшла в цьому році
    if (nextBirthday.isBefore(today)) {
      nextBirthday = nextBirthday.add(1, 'year'); // Додати один рік до дати народження
    }
    
    // Обчислити кількість днів до наступного дня народження
    return nextBirthday.diff(today, 'day');
}

  ngAfterViewInit(): void {
    this.initMap();
  }
  private initMap(): void {
    // Accessing the latitude and longitude values from the coordinates property of the user object
    const latitude = this.user?.coordinates.latitude;
    const longitude = this.user?.coordinates.longitude;

    // Check if latitude and longitude are available
    if (latitude !== undefined && longitude !== undefined) {
        // Initialize the map with the user's coordinates
        this.map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        const pinIcon = L.icon({
          iconUrl: '/assets/pin.png',
          iconSize: [38, 38], // Set the size of the icon
          iconAnchor: [19, 38], // Set the anchor point of the icon (where it's attached to the marker)
          popupAnchor: [0, -38] // Set the popup anchor relative to the icon
      });

      // Add marker with custom icon to the map
      L.marker([latitude, longitude], { icon: pinIcon }).addTo(this.map)
          .bindPopup('I am here')
          .openPopup();
    } else {
        console.error('Coordinates are not available');
    }
}

  toggleStar(): void {
    this.user!.favorite=!this.user!.favorite;
  }
}
