import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  loaderService = inject(LoaderService);
  router = inject(Router);

  error!: string;

  form: FormGroup = this.fb.group({
    Username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.authService
      .signup(this.form.value.email, this.form.value.password)
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
