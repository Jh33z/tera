import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private fns: AngularFireFunctions) {}
  setRole(uid: string, role: string) {
    const callable = this.fns.httpsCallable('setCustomClaims');
    return callable({ uid, role }).toPromise();
  }
}
