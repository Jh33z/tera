import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IUser } from '../../shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  userService = inject(UserService);
  loaderService = inject(LoaderService);
  users$!: Observable<IUser[]>;
  displayedColumns: string[] = [
    'id',
    'name',
    'lastName',
    'email',
    'role',
    'actions',
  ];
  ngOnInit(): void {
    this.users$ = this.userService.fetchUsers();
  }
  onDelete(id: string) {
    this.userService
      .deleteUser(id)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe();
  }
}
