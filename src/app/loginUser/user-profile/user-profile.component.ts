import { HttpClient } from '@angular/common/http';
import { Component, Directive, ElementRef, Injector, OnInit, Type, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { AdminNavComponent } from 'src/app/components/nav/admin-nav/admin-nav.component';
import { LoginNavComponent } from 'src/app/components/nav/login-nav/login-nav.component';
import { Role } from 'src/app/role';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  hasSuccess = false
  successComponent: Type<any>
  successInjector: Injector

  @ViewChild('nav') nav: ElementRef;
  @ViewChild('nav', { read: LoginNavComponent}) loginNavComponent: LoginNavComponent
  @ViewChild('nav', { read: AdminNavComponent}) adminNavComponent: AdminNavComponent

  role: Role

  username : string = 'Username'
  firstName : string = 'First name'
  lastName : string = 'Last name'
  email : string = 'email@gmail.com'
  phone : string = '3800992222222'
  dateOfBirth : any = '2020-01-01'


  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector
    ) {}

  ngOnInit(): void {
    this.resolveParams()
    this.role = this.auth.getUser().role
    this.getUserRequest().then((res) => {
      let user: any = res
      this.username = user.username
      this.firstName = user.first_name
      this.lastName = user.last_name
      this.email = user.email
      this.phone = user.phone
      this.dateOfBirth = user.date_of_birth
    })
  }

  logout(){
    this.auth.logout()
    this.router.navigate(['/login'], {relativeTo: this.route})
  }

  changePassword(){
    this.router.navigate(['/change_password'], {relativeTo: this.route})
  }

  editProfile(){
    this.router.navigate(['/edit_profile'], {relativeTo: this.route})
  }

  getUserRequest(){
    return this.http.get('/user', {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  displaySuccess(message: string){
    this.hasSuccess = true
    this.successComponent = BaseErrorComponent
    this.successInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: true}}], this.injector)
  }

  resolveParams(){
    this.route.queryParams.subscribe((param: any) => {
      if (param['password'] == 'success') this.displaySuccess('Password was changed')
      if (param['edit_profile'] == 'success') this.displaySuccess('Personal information was changed')
    })
  }
}
