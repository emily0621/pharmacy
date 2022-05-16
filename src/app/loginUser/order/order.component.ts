import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { FullOrderInformationComponent } from 'src/app/components/full-order-information/full-order-information.component';
import { RedirectingService } from 'src/app/redirecting.service';
import { Role } from 'src/app/role';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  role: Role

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  id: number
  orderComponent: Type<any>
  orderInjector: Injector

  constructor(
    private redirecting: RedirectingService,
    private route: ActivatedRoute,
    private injector: Injector,
    private http: HttpClient,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => { this.id = param.id })
    this.role = this.auth.getUser().role
    this.orderComponent = FullOrderInformationComponent
    this.orderInjector = Injector.create([{provide: Number, useValue: this.id}], this.injector)
  }

  cancelOrder(){
    this.auth.checkUser().then(() => {
      if (this.auth.getUser().role == Role.loginUser){
        this.deleteOrderRequest().then((response: any) => {
          this.redirecting.redirect('/user_orders/1', {delete: true})
        }, (error) => {
          console.log(error.error.message)
          this.displayError(error.error.message)
        })
      } else {
        this.userFromOrderRequest().then((response: any) => {
          console.log(response)
          this.deleteOrderRequest().then(() => {
            this.redirecting.redirect('/user_orders/' + response.username + '/1', null)
          })
        }, (error) => {
          console.log(error)
        })
      }
    })
  }

  userPage(){
    this.auth.checkUser().then(() => {
      this.userFromOrderRequest().then((response: any) => {
        this.redirecting.redirect('/user_page/' + response.username, {delete: true})
      }, (error) => {
        console.log(error.error.message)
      })
    })
  }

  displayError(message: string){
    this.hasError = true
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message}}], this.injector)
  }

  medicineInOrder(){
    this.redirecting.redirect('/medicine/order/' + this.id + '/1', null)
  }

  deleteOrderRequest(){
    return this.http.delete('/order/' + this.id, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  userFromOrderRequest(){
    return this.http.get('/username_from_order/' + this.id, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
