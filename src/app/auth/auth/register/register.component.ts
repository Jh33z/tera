import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  loaderService = inject(LoaderService);
  userService = inject(UserService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  dialogRef = inject(MatDialogRef);
  constructor(@Inject(MAT_DIALOG_DATA) public data: IUser) {}
  error!: string;
  @Output() dialogCloser = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.openedFromHomeFn();
    this.form.patchValue(this.data);
  }
  //route checker
  getCurrentRoute() {
    return this.router.url;
  }
  doesRouteContain(segment: string): boolean {
    return this.router.url.includes(segment);
  }
  checkRoute() {
    return this.doesRouteContain('/home');
  }
  checked!: boolean;
  openedFromHomeFn() {
    this.userService.openedFromHome.subscribe((res) => {
      this.checked = res;
    });
  }
  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    if (!!this.data && this.checkRoute() && !this.checked) {
      this.userService.updateUser(this.form.value).subscribe(
        () => {
          console.log('clicked');

          this.userService.updateUserList.next();
          this.dialogCloser.emit();
          this.router.navigate(['/home']);
        },
        (errorMsg) => {
          this.error = errorMsg;
        }
      );
    } else if (!this.data && this.checkRoute() && this.checked) {
      this.authService.signup(this.form.value, false).subscribe(
        (res) => {
          console.log('clicked');
          this.dialogCloser.emit();
          this.userService.updateUserList.next();
          this.router.navigate(['/home']);
        },
        (errorMsg) => {
          this.error = errorMsg;
        }
      );
    } else {
      this.authService.signup(this.form.value).subscribe(
        (res) => {
          this.dialogCloser.emit();
          localStorage.setItem('token', res[0].idToken);
          this.authService.currentUserSig.set(res[0]);
          this.router.navigate(['/home']);
        },
        (errorMsg) => {
          this.error = errorMsg;
        }
      );
    }
  }
}
