import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { UserInformationComponent } from 'src/app/components/user_information/user-information/user-information.component';
import { RedirectingService, USER_SIZE } from 'src/app/redirecting.service';

export class Information{

  properties: Array<string>
  values: Array<string>

  constructor(properties: Array<string>, values: Array<string>){
    this.properties = properties
    this.values = values
  }
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  errorInjector: Injector
  errorComponent: Type<any>
  hasError: boolean = false

  hasPrev: boolean
  hasNext: boolean

  count: number

  properties: Array<string> = ['Username: ', 'First name: ', 'Last name: ', 'Email: ', 'Phone: ', 'Date of birth: ']

  private usernames: Array<string> | null = null
  private firstNames: Array<string> | null = null
  private lastNames: Array<string> | null = null
  private phone: Array<string> | null = null
  private email: Array<string> | null = null
  private dateOfBirth: Array<string> | null = null
  private page: number = 1

  userInjectors: Array<Injector>
  users: Array<any>
  component: Type<any>

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private route: ActivatedRoute,
    public redirecting: RedirectingService
    ) {
      this.route.params.subscribe((param: any) => {
        this.redirecting.initPages(param.page)
        this.redirecting.baseUrl = this.redirecting.getRouter().url.split('?')[0]
      })
    }

  ngOnInit(): void {
    this.resolveParams()
    this.component = UserInformationComponent
    let data = {
      username: this.usernames,
      first_name: this.firstNames,
      last_name: this.lastNames,
      phone: this.phone,
      email: this.email,
      date_of_birth: this.dateOfBirth,
      page: 1
    }
    this.auth.checkUser().then(() => {
      this.findUserRequest(data).then((response: any) => {
        if (response.count == 0) this.displayError()
        else{
          this.users = response.users
          this.redirecting.checkPagesExists(response.users.length, response.count, USER_SIZE)
          this.userInjectors = new Array<Injector>()
          this.users.forEach((user) => {
            let values = [user.username, user.first_name, user.last_name, user.email, user.phone, user.date_of_birth]
            let injector = Injector.create([{provide: Information, useValue: {properties: this.properties, values: values}}], this.injector)
            this.userInjectors.push(injector)
          })
        }
      })
    })
  }

  displayError(){
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: "Users not found", type: false}}], this.injector)
    this.errorComponent = BaseErrorComponent
    this.hasError = true
  }

  findUserRequest(data: any){
    return this.http.post('/findUser/' + this.redirecting.page, data, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  resolveParams(){
    this.route.queryParams.subscribe((params: any) => {
      this.redirecting.queryParams = params
      if (params['username']) this.usernames = params['username']
      if (params['first_name']) this.firstNames = params['first_name']
      if (params['last_name']) this.lastNames = params['last_name']
      if (params['phone']) this.phone = params['phone']
      if (params['email']) this.email = params['email']
      if (params['date_of_birth']) this.dateOfBirth = params['date_of_birth']
    })
  }
}
