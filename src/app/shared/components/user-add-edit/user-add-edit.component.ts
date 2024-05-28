import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';
import { catchError, throwError } from 'rxjs';

interface Roles {
  id: number;
  roleTitle: string;
}
@Component({
  selector: 'app-user-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css'],
})
export class UserAddEditComponent {
  @Output() dialogCloser = new EventEmitter<void>();
  fb = inject(FormBuilder);
  userService = inject(UserService);
  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    role: ['', Validators.required],
  });
  roles: Roles[] = [
    {
      id: 1,
      roleTitle: 'admin',
    },
    {
      id: 2,
      roleTitle: 'user',
    },
  ];

  onSubmit() {
    this.userService
      .onCreateUser(this.userForm.value)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe();
    this.dialogCloser.emit();
  }
}
