import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { UserInformationComponent } from 'src/app/components/user_information/user-information/user-information.component';

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
    private router: Router,
    private route: ActivatedRoute,
    )
    {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
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
        this.count = response.count
        if (this.count == 0) this.displayError()
        else{
          this.users = response.users
          this.userInjectors = new Array<Injector>()
          this.users.forEach((user) => {
            let values = [user.username, user.first_name, user.last_name, user.email, user.phone, user.date_of_birth]
            let injector = Injector.create([{provide: Information, useValue: {properties: this.properties, values: values}}], this.injector)
            this.userInjectors.push(injector)
          })
          this.hasNextPage()
          this.hasPreviousPage()
        }
      })
    })
  }

  getPrevPage(){
    let params = {
      username: this.usernames,
      first_name: this.firstNames,
      last_name: this.lastNames,
      phone: this.phone,
      email: this.email,
      date_of_birth: this.dateOfBirth,
      page: this.page - 1
    }
    this.router.navigate(['/users'], {queryParams: params, relativeTo: this.route})
  }

  hasPreviousPage(){
    if (this.page == 1) this.hasPrev = false
    else this.hasPrev = true
    console.log(this.hasPrev)
  }

  getNextPage(){
    let params = {
      username: this.usernames,
      first_name: this.firstNames,
      last_name: this.lastNames,
      phone: this.phone,
      email: this.email,
      date_of_birth: this.dateOfBirth,
      page: this.page + 1
    }
    this.router.navigate(['/users'], {queryParams: params, relativeTo: this.route})
  }

  displayError(){
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: "Users not found", type: false}}], this.injector)
    this.errorComponent = BaseErrorComponent
    this.hasError = true
  }

  hasNextPage(){
    console.log(this.users.length, this.count)
    console.log(typeof(this.page))
    if ((this.page - 1) * 8 + this.users.length == this.count) this.hasNext = false
    else this.hasNext = true
    console.log(this.hasNext)
  }

  findUserRequest(data: any){
    return this.http.post('/findUser', data, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  resolveParams(){
    this.route.queryParams.subscribe((params: any) => {
      if (params['username']) this.usernames = params['username']
      if (params['first_name']) this.firstNames = params['first_name']
      if (params['last_name']) this.lastNames = params['last_name']
      if (params['phone']) this.phone = params['phone']
      if (params['email']) this.email = params['email']
      if (params['date_of_birth']) this.dateOfBirth = params['date_of_birth']
      if (params['page']) this.page = parseInt(params['page'])
    })
  }
}
