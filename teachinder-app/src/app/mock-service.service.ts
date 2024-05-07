import { Injectable } from '@angular/core';
import { additionalUsers, randomUserMock } from '../assets/FE4U-Lab3-mock';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from './data/user.interface';
import * as _ from 'lodash';
declare module '../assets/FE4U-Lab3-mock.js' {
  export const randomUserMock: any[];
  export const additionalUsers: any[];
}
@Injectable({
  providedIn: 'root',
})

export class MockServiceService {
  speciality = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"];
  formateList = ["id", "gender", "title", "full_name", "city", "state", "country", "postcode", "coordinates", "timezone", "email", "b_day", "age", "phone", "picture_Large", "picture_thumbnail", "favorite", "course", "bg_color", "note"];

  constructor(private http: HttpClient) { }


  generateRandomUserList(): Observable<User[]> {
    return this.http.get<any[]>('https://randomuser.me/api/?results=50').pipe(
      map((response: any) => {
        const users: User[] = this.formatUserList(response.results); // Assuming the user data is nested under 'results' property
        return users.filter(user => this.validateUser(user));
      }),
      catchError((error: any) => {
        console.error('Error fetching user list:', error);
        return throwError('Error fetching user list'); // You can customize the error handling as needed
      })
    );
  }
  generateRandomUserListMore(): Observable<User[]> {
    return this.http.get<any[]>('https://randomuser.me/api/?results=10').pipe(
      map((response: any) => {
        const users: User[] = this.formatUserList(response.results); // Assuming the user data is nested under 'results' property
        return users.filter(user => this.validateUser(user));
      }),
      catchError((error: any) => {
        console.error('Error fetching user list:', error);
        return throwError('Error fetching user list'); // You can customize the error handling as needed
      })
    );
  }
  
  getRandomUsers(): Observable<any> {
    return this.http.get('https://randomuser.me/api/?results=50');
  }

  getRandomSpeciality(specialties: string[]): string {
    return specialties[Math.floor(Math.random() * specialties.length)];
  }

  repeatableObject(list: any[], obj: any): boolean {
    for (const item of list) {
      if (item.email === obj.email && obj.email != null) {
        return true;
      }
    }
    return false;
  }

  formatUserList(randomUserMock: any[]): any[] {
    const newListOfUsers = randomUserMock.map((el: any) => {
      return {
        "id": randomUserMock.indexOf(el) + 1,
        "gender": el.gender,
        "title": el.name.title,
        "full_name": el.name.first + " " + el.name.last,
        "city": el.location.city,
        "state": el.location.state,
        "country": el.location.country,
        "postcode": + el.location.postcode,
        "coordinates": el.location.coordinates,
        "timezone": el.location.timezone,
        "email": el.email,
        "b_day": el.dob.date,
        "age": + el.dob.age,
        "phone": el.phone,
        "picture_Large": el.picture.large,
        "picture_thumbnail": el.picture.thumbnail,
        "favorite": false,
        "course": this.getRandomSpeciality(this.speciality),
        "bg_color": null,
        "note": null
      };
    });

    for (const item of additionalUsers) {
      for (const prop of this.formateList) {
        if (!item.hasOwnProperty(prop)) {
          item[prop] = undefined;
        }
      }
      item["id"] = newListOfUsers.length + 1;
      if (item["course"] === undefined) {
        item["course"] = this.getRandomSpeciality(this.speciality);
      }
      if (!this.repeatableObject(newListOfUsers, item)) {
        newListOfUsers.push(item);
      }
    }

    return newListOfUsers;
  }
  //////////
  generateUserList() {
    const getRandomSpeciality = (specialties: string[]) => specialties[Math.floor(Math.random() * specialties.length)];

    const repeatableObject = (list: any[], obj: any) => {
      for (const item of list) {
        if (item.email === obj.email && obj.email != null) {
          return true;
        }
    
      }
      return false;
    };
    

    const newListOfUsers = randomUserMock.map((el: { gender: any; name: { title: any; first: string; last: string; }; location: { city: any; state: any; country: any; postcode: string | number; coordinates: any; timezone: any; }; email: any; dob: { date: any; age: string | number; }; phone: any; picture: { large: any; thumbnail: any; }; }) => {
      return {
        "id": randomUserMock.indexOf(el) + 1,
        "gender": el.gender,
        "title": el.name.title,
        "full_name": el.name.first + " " + el.name.last,
        "city": el.location.city,
        "state": el.location.state,
        "country": el.location.country,
        "postcode": + el.location.postcode,
        "coordinates": el.location.coordinates,
        "timezone": el.location.timezone,
        "email": el.email,
        "b_day": el.dob.date,
        "age": + el.dob.age,
        "phone": el.phone,
        "picture_Large": el.picture.large,
        "picture_thumbnail": el.picture.thumbnail,
        "favorite": false,
        "course": getRandomSpeciality(this.speciality),
        "bg_color": null,
        "note": null
      };
    });

    for (const item of additionalUsers) {
      for (const prop of this.formateList) {
        if (!item.hasOwnProperty(prop)) {
          item[prop] = undefined;
        }
      }
      item["id"] = newListOfUsers.length + 1;
      if (item["course"] === undefined) {
        item["course"] = getRandomSpeciality(this.speciality);
      }
      if (!repeatableObject(newListOfUsers, item)) {
        newListOfUsers.push(item);
      }
    }

    return newListOfUsers;
  }

isStringWithUppercase(value: any): boolean {
    if (typeof value !== 'string') return false;

    if (value.length === 0) return false;

    return value.charAt(0) === value.charAt(0).toUpperCase();
}

 validateUser(user: any): boolean {
    let name: string = user['full_name'].split(' ')[0];
    let surname: string = user['full_name'].split(' ')[1];

    let isNameValidated: boolean = this.isStringWithUppercase(name) && this.isStringWithUppercase(surname);
    let isSexValidated: boolean = typeof user['gender'] === 'string';
    let isCourseValidated: boolean = this.isStringWithUppercase(user['course']);
    let isCountryValidated: boolean = this.isStringWithUppercase(user['country']);
    let isAgeValidated: boolean = user['age'] != undefined && user['age'] != null && !isNaN(user['age']);

    if (!isNameValidated || !isSexValidated || !isCourseValidated || !isCountryValidated || !isAgeValidated) {
        return false;
    }

    if (isNaN(user['age'])) {
        return false;
    }

    if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(user['phone'])) {
        return false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user['email'])) {
        return false;
    }

    return true;
}

filterUsersByCriteria(users: any[], country: string, age: number, gender: string, favorite: boolean) {
  return _.filter(users, { 'age': age, 'gender': gender, 'country': country, 'favorite': favorite });
}
  
sortUserObjects(objects: any[], sortBy: string, isDescending: boolean) {
  return _.orderBy(objects, sortBy, isDescending ? 'desc' : 'asc');
}

searchUserObjects(objects: any[], searchParameter: string, searchValue: any) {
  return _.filter(objects, [searchParameter, searchValue]);
}

  calculatePercentage(filteredTeacher: any[], teachers: any[]) {
    return (filteredTeacher.length / teachers.length) * 100;
  }
}
