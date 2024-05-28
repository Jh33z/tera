import { Component, inject } from '@angular/core';
import { RoleService } from './core/role.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  roleService = inject(RoleService);
  setRoleForUser() {
    const uid = 'USER_UID_HERE';
    const role = 'admin';
    this.roleService
      .setRole(uid, role)
      .then((response) => {
        console.log(response.message);
      })
      .catch((error) => {
        console.error('Error setting role:', error);
      });
  }
}
