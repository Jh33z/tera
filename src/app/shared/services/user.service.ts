import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  forkJoin,
  map,
  shareReplay,
  throwError,
} from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  router = inject(Router);
  error = new Subject<string>();
  updateUserList = new Subject<void>();
  openedFromHome = new BehaviorSubject<boolean>(false);
  userDetailsSubject = new BehaviorSubject<IUser | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable();
  onCreateUser(user: IUser) {
    const createUserRequest = this.http.post(
      'https://tera-4d0b2-default-rtdb.firebaseio.com/users.json',
      user
    );
    const signUpRequest = this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBrV82VMyxlhHWqXHcNxZpcBxzufedbqkM',
      {
        email: user.email,
        password: 'password',
        returnSecureToken: true,
      }
    );
    return forkJoin([createUserRequest, signUpRequest]);
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
  updateUser(user: IUser) {
    return this.http.put(
      `https://tera-4d0b2-default-rtdb.firebaseio.com/users/${user.id}.json`,
      user
    );
  }
  deleteUser(user: IUser) {
    return this.http.delete(
      `https://tera-4d0b2-default-rtdb.firebaseio.com/users/${user.id}.json`
    );

    //!!!!!!!!!!!!!cant use forkJoin, firebase doesnt support deleting user from only front-end!!!!!!!!!!!!!!!!

    // const idToken = localStorage.getItem('token');
    // const deleteUserFromAuth = this.http.post(
    //   `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBrV82VMyxlhHWqXHcNxZpcBxzufedbqkM`,
    //   { idToken: idToken }
    // );

    // return forkJoin([deleteUserFromDatabase, deleteUserFromAuth]);
  }

  setUserDetails(user: IUser) {
    this.userDetailsSubject.next(user);
  }
  getUserDetails(): Observable<IUser | null> {
    return this.userDetails$;
  }
}
