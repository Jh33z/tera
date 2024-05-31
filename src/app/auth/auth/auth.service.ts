import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Subject, catchError, forkJoin, tap, throwError } from 'rxjs';
import { User } from './auth.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthResData } from 'src/app/shared/interfaces/auth.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  afAuth = inject(AngularFireAuth);
  private role = '';

  user = new Subject<User | null>();
  currentUserSig = signal<AuthResData | undefined | null>(undefined);

  signup(user: IUser, modify: boolean = true) {
    const singUserUp = this.http
      .post<AuthResData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBrV82VMyxlhHWqXHcNxZpcBxzufedbqkM',
        {
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErr),
        tap((resData) => {
          if (user.email.split('@')[1].includes('admin')) {
            this.role = 'admin';
          } else {
            this.role = 'user';
          }
          // Store the user initially
          this.storeUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          if (modify) {
            localStorage.setItem('role', this.role);
          }
        })
      );
    const singUserInDB = this.http.post(
      'https://tera-4d0b2-default-rtdb.firebaseio.com/users.json',
      user
    );
    return forkJoin([singUserUp, singUserInDB]);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBrV82VMyxlhHWqXHcNxZpcBxzufedbqkM',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErr),
        tap((resData) => {
          if (email.split('@')[1].includes('admin')) {
            this.role = 'admin';
          } else {
            this.role = 'user';
          }
          this.storeUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          localStorage.setItem('role', this.role);
        })
      );
  }
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  private storeUser(
    email: string,
    userId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expiration = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, idToken, expiration);
    this.user.next(user);
  }

  private handleErr(err: HttpErrorResponse) {
    let errorMsg = 'Unknown error';
    if (!err || !err.error.error) {
      return throwError(errorMsg);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'This email does no exist';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Password is invalid';
        break;
      case 'INVALID_EMAIL':
        errorMsg = 'Email is invalid';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMsg = 'Invalid login credentials';
        break;
    }
    return throwError(errorMsg);
  }
}
