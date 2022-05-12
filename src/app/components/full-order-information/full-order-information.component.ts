import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-full-order-information',
  templateUrl: './full-order-information.component.html',
  styleUrls: ['./full-order-information.component.scss']
})
export class FullOrderInformationComponent implements OnInit {

  constructor(
    private id: Number,
    private http: HttpClient,
    private auth: AuthService,
    private redirection: RedirectingService
    ) {
  }

  ngOnInit(): void {
    this.getOrderRequest().then((response: any) => {
      console.log(response)
    }, (error) => {
      console.log(error.error.message)
      this.redirection.sendNotFound()
    })
  }

  getOrderRequest(){
    return this.http.get('/order/' + this.id.valueOf(), {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
