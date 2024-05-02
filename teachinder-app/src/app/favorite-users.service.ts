// favorite-users.service.ts
import { Injectable } from '@angular/core';
import { User } from './data/user.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteUsersService {
    favoriteUsers: User[]=[];
    loadFavoriteUsers(users: User[]): User[] {
        this.favoriteUsers = users.filter(user => user.favorite === true);
        return users.filter(user => user.favorite === true);
    }
}
