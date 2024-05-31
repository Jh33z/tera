import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  userService = inject(UserService);
  userDetails$!: Observable<IUser | null>;

  getRole: string = '';

  ngOnInit(): void {
    this.userDetails$ = this.userService.getUserDetails().pipe(
      tap((user: any) => {
        if (user.email.split('@')[1].includes('admin')) {
          this.getRole = 'admin';
        } else {
          this.getRole = 'user';
        }
      })
    );
  }
  router = inject(Router);
  prevPage() {
    this.router.navigate(['/home']);
  }
}
