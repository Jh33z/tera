import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './auth.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

interface AuthResData {
  kind: string;
  idToken: string;
  email: string;
  role: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  afAuth = inject(AngularFireAuth);
  private fns = inject(AngularFireFunctions);

  user = new Subject<User | null>();
  currentUserSig = signal<AuthResData | undefined | null>(undefined);

  signup(email: string, password: string) {
    return this.http
      .post<AuthResData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBrV82VMyxlhHWqXHcNxZpcBxzufedbqkM',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleErr),
        tap((resData) => {
          console.log(resData);
          // Store the user initially
          this.storeUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    console.log('we are in the loginnnnnnnn');
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
          this.storeUser(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
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
