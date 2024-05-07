import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddTeacherComponent } from '../add-teacher/add-teacher.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeacherInfoComponent } from '../teacher-info/teacher-info.component';
import { MockServiceService } from '../mock-service.service';
import { User } from '../data/user.interface';
import { CommonModule } from '@angular/common';
import { countryToRegion } from '../data/country-to-region';
import { FavoriteUsersService } from '../favorite-users.service';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import * as _ from 'lodash'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TeacherInfoComponent,MatDialogModule,CommonModule,FormsModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] 
})
export class HomeComponent implements OnInit{
  validUsers: User[] = [];
  favoriteUsers: User[] =[];
  usersList: User[]=[];
  filteredUserList: User[]=[];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortField: string = 'full_name'; // Default sorting field
  isDescending: boolean = false; // Default sorting order
  visibleFavoriteUsers: User[] = [];
  startIndex: number = 0;
  endIndex: number = 5;
  currentChart: any;
  private apiUrl = 'http://localhost:3000/users'; // URL вашого json-server



  constructor(private dialog: MatDialog, private mockService: MockServiceService,  private http: HttpClient, private favoriteUsersService: FavoriteUsersService) {}

  ngOnInit(): void {
    this.generateValidUserList();
    this.loadFavoriteUsers();
    this.updateVisibleFavoriteUsers();
    this.filteredUserList = this.validUsers.slice();
    this.chartOptions.forEach(option => {
      const button = document.getElementById(option.id);
      button?.addEventListener('click', () => this.onChartButtonClick(option.key));
    });
  }

  chartOptions: any[] = [
    { id: 'chart-age', key: 'age' },
    { id: 'chart-course', key: 'course' },
    { id: 'chart-gender', key: 'gender' },
    { id: 'chart-nationality', key: 'country' }
  ];

  renderChart(labels: string[], data: number[]): void {
    const chartElement = document.getElementById("currentChart") as HTMLCanvasElement; // Cast to HTMLCanvasElement
    if (!chartElement) chartElement ;
  
    if (this.currentChart) this.currentChart.destroy();
  
    this.currentChart = new Chart(chartElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.getColorsArray(labels.length)
        }]
      }
    });
  }
  onChartButtonClick(key: string): void {
    const labels = this.validUsers.map(user => user[key as keyof User]);
    const uniqueLabels = _.uniq(labels);
    const data = uniqueLabels.map(label => this.validUsers.filter(user => user[key as keyof User] === label).length);
  
    this.renderChart(uniqueLabels, data);
  }
  

  getColorsArray(length: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomColor = this.generateRandomColor();
      colors.push(randomColor);
    }
    return colors;
  }
  
  generateRandomColor(): string {
    // Generate a random color in hexadecimal format
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  }
  
  generateValidUserList() {
    this.mockService.generateRandomUserList().subscribe(
      (users: User[]) => {
        this.usersList = users;
        this.validUsers = this.usersList.filter(user => this.mockService.validateUser(user));
        this.filteredUserList = this.validUsers.slice();
        // this.drawPieChart();
        this.onChartButtonClick('age');
      },
      (error) => {
        console.error('Error fetching user list:', error);
      }
    );
  }
 
  // generateValidUserList(): void {
  //   // Generate new random users
  //   this.mockService.generateRandomUserList().subscribe(
  //     (newUsers: User[]) => {
  //       // Filter and add only valid users
  //       const validNewUsers = newUsers.filter(user => this.mockService.validateUser(user));
        
  //       // Append the newly generated users to the existing user list
  //       this.validUsers.push(...validNewUsers);
  //       this.filteredUserList = this.validUsers.slice();
  
  //       // Add the newly generated users to the JSON file
  //       this.addUsersToJSON(validNewUsers).subscribe(
  //         () => {
  //           console.log('New users added to JSON successfully.');
  //         },
  //         (error) => {
  //           console.error('Error adding new users to JSON:', error);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Error generating random user list:', error);
  //     }
  //   );
  // }
  
  addUsersToJSON(users: User[]): Observable<void> {
    return this.http.post<void>(this.apiUrl, users);
  }

  //opens add teacher popup
  openAddTeacherPopup(): void {
    const dialogRef=this.dialog.open(AddTeacherComponent, {
    });
    dialogRef.componentInstance.addUser.subscribe((formData: any) => {
      this.addUserToValidUsers(formData);
      
    });
    } 
    goToFirstPage(): void {
      this.currentPage = 1;
    }
  
    goToLastPage(): void {
      this.currentPage = Math.ceil(this.usersList.length / this.itemsPerPage);
    }
  //opens teacher info popup
  openTeacherInfoPopup(user: User): void {
    this.dialog.open(TeacherInfoComponent, {
      data:user
    });
  }

  loadFavoriteUsers() {
    this.favoriteUsers =this.favoriteUsersService.loadFavoriteUsers(this.validUsers);
    this.updateVisibleFavoriteUsers();
  }

  //add to favorities
  toggleStar(user: User): void {
    user!.favorite=!user!.favorite;
    this.loadFavoriteUsers();
  } 
  nextPageNewUsers(){
    this.mockService.generateRandomUserListMore().subscribe(
      (users: User[]) => {
        this.usersList = this.usersList.concat(users);
        this.validUsers = this.usersList.concat().filter(user => this.mockService.validateUser(user));
        this.filteredUserList = this.validUsers.slice();
      },
      (error) => {
        console.error('Error fetching user list:', error);
      }
    );
  }

  nextPage(): void {
    this.currentPage++;
  }

  previousPage(): void {
    this.currentPage--;
  }

searchUsers(): void {
  if (!this.searchText) {
    this.filteredUserList = [];
    return;
  }
  
  const searchTextLower = this.searchText.toLowerCase(); // Convert search text to lowercase for case-insensitive search
  
  // Filter users by full name, note, or age
  this.filteredUserList = this.validUsers.filter(user => {
    const fullName = (user.full_name || '').toLowerCase(); // Convert full name to lowercase
    const note = (user.note || '').toLowerCase(); // Convert note to lowercase
    const age = user.age ? user.age.toString() : ''; // Convert age to string for comparison
    
    return fullName.includes(searchTextLower) || note.includes(searchTextLower) || age.includes(searchTextLower);
  });
}


  filterUsers(): void {
    const selectedAgeRange = this.getSelectedAgeRange();
    const selectedRegion = (document.getElementById('region') as HTMLSelectElement).value;
    const selectedGender = (document.getElementById('gender') as HTMLSelectElement).value;
    const onlyWithPhoto = (document.getElementById('photo') as HTMLInputElement).checked;
    const onlyFavorites = (document.getElementById('favorites') as HTMLInputElement).checked;

    this.filteredUserList = this.validUsers.filter(user =>
      countryToRegion[user.country] === selectedRegion &&
      user.age >= selectedAgeRange.min && user.age <= selectedAgeRange.max &&
      user.gender.toLowerCase() === selectedGender.toLowerCase() &&
      (!onlyWithPhoto || (user.picture_Large !== undefined && user.picture_Large !== null)) &&
      (!onlyFavorites || user.favorite)
    );
  }

  getSelectedAgeRange(): { min: number, max: number } {
    const ageGroup = (document.getElementById('age') as HTMLSelectElement).value;
    switch (ageGroup) {
      case '18-31':
        return { min: 18, max: 31 };
      case '32-45':
        return { min: 32, max: 45 };
      case '46-58':
        return { min: 46, max: 58 };
      case '59-71':
        return { min: 59, max: 71 };
      default:
        return { min: 0, max: 100 }; // Default range
    }
  }
  sort(field: string): void {
    // Toggle sorting order if clicking on the same field
    if (field === this.sortField) {
      this.isDescending = !this.isDescending;
    } else {
      // If clicking on a different field, reset sorting order
      this.sortField = field;
      this.isDescending = false;
    }

    // Sort the usersList based on the selected field and sorting order
    this.usersList = this.mockService.sortUserObjects(this.usersList, this.sortField, this.isDescending);
  }

  addUserToValidUsers(formData: any): void {
    // Process the form data and add the user to the validUsers array
    const newUser: User = {
      id: this.validUsers.length + 1,
      gender: formData.gender,
      title: null,
      full_name: formData.full_name,
      city: formData.city,
      state: null,
      country: formData.Country,
      postcode: null,
      coordinates: null,
      timezone: null,
      email: formData.email,
      b_day: formData.dob,
      age: this.getAgeFromBirthDate(new Date(formData.dob)),
      phone: formData.phone,
      picture_Large: null,
      picture_thumbnail: null,
      favorite: false,
      course: formData.course,
      bg_color: formData.background_color,
      note: formData.comment
    };
    
    this.http.post(this.apiUrl, newUser).subscribe(
      (response: any) => {
        // On successful addition, update the local user arrays
        console.log('User added successfully:', response);
        this.usersList.push(newUser);
        this.validUsers.push(newUser);
        this.loadFavoriteUsers();
      },
      (error: any) => {
        // Handle errors if the POST request fails
        console.error('Error adding user:', error);
      }
    );    this.usersList.push(newUser);
    this.validUsers.push(newUser);
   this.loadFavoriteUsers();
  
  }

  // Helper function to calculate age from birth date
  private getAgeFromBirthDate(birthDate: Date): number {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  scrollLeft() {
      this.loadFavoriteUsers();
      if(this.startIndex>0){
        this.startIndex--;
        this.endIndex--;
        this.updateVisibleFavoriteUsers();
      }
  }
  
  scrollRight() {
      this.loadFavoriteUsers();
      if(this.favoriteUsers.length!=this.endIndex){
        this.startIndex++;
         this.endIndex++;
        this.updateVisibleFavoriteUsers();
      }  
  }
  
  // Update the visible range of favorite users
  updateVisibleFavoriteUsers() {
      this.visibleFavoriteUsers = this.favoriteUsers.slice(this.startIndex, this.endIndex);
  }
}
