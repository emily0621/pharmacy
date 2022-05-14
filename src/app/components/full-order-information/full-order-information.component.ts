import { LowerCasePipe } from '@angular/common';
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

  date: string
  status: string
  medicine: string = ''
  totalPrice: string = '100$'

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
      this.date = response.date_order
      this.status = response.status
      this.medicineFromOrderRequest().then((response: any) => {
        let price = 0
        for (let i = 0; i < response.count.length; i++){
          console.log("test: ", response.medicine[i].name_medicine)
          if (this.medicine.length < 50) this.medicine += response.medicine[i].name_medicine.toLowerCase() + ', '
          price += response.count[i].count * response.medicine[i].price
        }
        this.medicine = this.medicine.slice(0, -2)
        if (this.medicine.length > 50) this.medicine = this.medicine.slice(0, 47) + '...'
        this.totalPrice = price.toString() + '$'
      })
    }, (error) => {
      console.log(error.error.message)
      this.redirection.sendNotFound()
    })
  }

  getOrderRequest(){
    return this.http.get('/order/' + this.id.valueOf(), {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  medicineFromOrderRequest(){
    return this.http.get('/all_medicine_in_order/' + this.id.valueOf(), {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
