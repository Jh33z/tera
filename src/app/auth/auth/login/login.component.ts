import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  fb = inject(FormBuilder);
  loaderService = inject(LoaderService);
  authService = inject(AuthService);
  router = inject(Router);

  error!: string;

  form: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  onSubmit() {
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .subscribe(
        (res) => {
          localStorage.setItem('token', res.idToken);
          this.authService.currentUserSig.set(res);
          this.router.navigate(['/home']);
        },
        (errorMsg) => {
          this.error = errorMsg;
        }
      );
  }
}
