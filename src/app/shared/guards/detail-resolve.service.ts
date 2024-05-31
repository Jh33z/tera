import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class DetailResolveService implements Resolve<any> {
  userService = inject(UserService);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const userId = route.paramMap.get('id');
    // return this.userService.setUserDetails(userId);
  }
}
