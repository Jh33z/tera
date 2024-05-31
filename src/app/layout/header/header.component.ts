import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  role = localStorage.getItem('role');
  isAuthenticated = false;

  subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(
      (user) => {
        this.isAuthenticated = !!user;
      },
      (error) => {
        console.error('Error in user subscription:', error);
      }
    );
  }

  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('role', '');
    this.authService.currentUserSig.set(null);
    this.router.navigate(['/auth/login']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
