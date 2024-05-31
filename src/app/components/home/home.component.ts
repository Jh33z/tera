import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IUser } from '../../shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { RegisterComponent } from 'src/app/auth/auth/register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  userService = inject(UserService);
  loaderService = inject(LoaderService);
  authService = inject(AuthService);
  dialog = inject(MatDialog);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  @Output() dialogCloser = new EventEmitter<void>();

  users$!: Observable<IUser[]>;
  role = localStorage.getItem('role');
  displayedColumns: string[] = [
    'name',
    'last name',
    'email',
    'gender',
    'actions',
  ];
  ngOnInit(): void {
    this.loadUsers();
    this.userService.updateUserList.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.users$ = this.userService.fetchUsers();
  }
  onDetails(user: IUser) {
    this.userService.setUserDetails(user);
    this.router.navigate(['/home/details', user.id], {
      queryParams: { details: true },
    });
  }

  openAddDialog() {
    this.userService.openedFromHome.next(true);
    const dialogRef = this.dialog.open(RegisterComponent);
    this.router.navigate(['/home'], { queryParams: { newUser: true } });
    dialogRef.componentInstance.dialogCloser.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userService.openedFromHome.next(false);
      this.router.navigate(['/home'], { queryParams: {} });
    });
  }
  onEdit(user: IUser) {
    this.router.navigate(['/home'], { queryParams: { edit: true } });
    const dialogRef = this.dialog.open(RegisterComponent, {
      data: user,
    });
    dialogRef.componentInstance.dialogCloser.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userService.openedFromHome.next(false);
      this.router.navigate(['/home'], { queryParams: {} });
    });
  }
  onDelete(user: IUser) {
    this.userService
      .deleteUser(user)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.userService.updateUserList.next();
      });
  }
}
