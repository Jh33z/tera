import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserAddEditComponent } from 'src/app/shared/components/user-add-edit/user-add-edit.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);
  dialog = inject(MatDialog);
  isAuthenticated = false;

  subscription!: Subscription;

  openAddDialog() {
    const dialogRef = this.dialog.open(UserAddEditComponent);
    this.router.navigate(['/home'], { queryParams: { newUser: true } });
    dialogRef.componentInstance.dialogCloser.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/home'], { queryParams: {} });
    });
  }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(
      (user) => {
        console.log('User subscription callback:', this.isAuthenticated);
        this.isAuthenticated = !!user;
      },
      (error) => {
        console.error('Error in user subscription:', error);
      }
    );
  }

  logout() {
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
    this.router.navigate(['/auth/login']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
