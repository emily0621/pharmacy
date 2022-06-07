import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private redirecting: RedirectingService
  ) {
    this.route.params.subscribe((param: any) => { this.username = param.username})
  }

  ngOnInit(): void {
    this.userByUsernameRequest().then((response: any) => {
      this.firstName = response.first_name
      this.lastName = response.last_name
      this.email = response.email
      this.phone = response.phone
      this.dateOfBirth = response.date_of_birth
    }, (error) => {
      console.log(error.error.message)
      this.redirecting.sendNotFound()
    })
  }

  orders(){
    this.redirecting.redirect('/user_orders/' + this.username + '/1', null)
  }

  userByUsernameRequest(){
    return this.http.get('/user/' + this.username, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
