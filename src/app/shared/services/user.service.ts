import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, catchError, map, throwError } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

interface User {
  name: string;
  lastName: string;
  email: string;
  role: { roleTitle: string };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  error = new Subject<string>();
  onCreateUser(user: IUser) {
    return this.http.post(
      'https://tera-4d0b2-default-rtdb.firebaseio.com/users.json',
      user
    );
  }
  fetchUsers() {
    return this.http
      .get<{ [key: string]: IUser }>(
        'https://tera-4d0b2-default-rtdb.firebaseio.com/users.json'
      )
      .pipe(
        map((userData) => {
          const usersArr: IUser[] = [];
          for (const key in userData) {
            if (userData.hasOwnProperty(key)) {
              usersArr.push({ ...userData[key], id: key });
            }
          }
          return usersArr;
        }),
        catchError((error) => {
          return throwError('err', error);
        })
      );
  }
  deleteUser(id: string) {
    return this.http.delete(
      `https://tera-4d0b2-default-rtdb.firebaseio.com/users/${id}.json`
    );
  }
}
