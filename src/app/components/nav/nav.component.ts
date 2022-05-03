import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GuestNavComponent } from './guest-nav/guest-nav.component';
import { LoginNavComponent } from './login-nav/login-nav.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { AuthGuard } from 'src/app/auth.guard';
import { AuthService } from 'src/app/auth.service';
import { Role } from 'src/app/role';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  role: Role

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.checkUser().then(() => {
      this.role = this.auth.getUser().role
    })
  }

}
