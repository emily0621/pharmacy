import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { OrderInformation, ShortOrderInformationComponent } from 'src/app/components/short-order-information/short-order-information.component';
import { ORDER_SIZE, RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  username: string | null = null

  orderComponent: Type<any>
  orderInjectors: Array<Injector>

  hasMessage : boolean = false
  messageComponent: Type<any>
  messageInjector: Injector

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    public redirecting: RedirectingService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: any) => {
      this.username = param.username
      this.redirecting.initPages(param.page)
    })
  }

  ngOnInit(): void {
    this.resolveParams().then(() => {
      if (this.username == null){
        this.ordersByUserRequest().then((response: any) => {
          if (response.count == 0){
            this.displayError('You don`t have any order', false)
          } else {
            this.orderComponent = ShortOrderInformationComponent
            this.orderInjectors = new Array<Injector>()
            const orders = JSON.parse(response.orders)
            this.redirecting.checkPagesExists(orders.length, response.count, ORDER_SIZE)
            orders.forEach((order: any) => {
              this.orderInjectors.push(Injector.create([{provide: OrderInformation,
                useValue: {id: order.id_order, date: order.date_order, status: order.status}}], this.injector))
            });
          }
        }, (error) => {
          console.log(error.error.message)
        })
    } else {
      this.ordersByUsernameRequest().then((response: any) => {
        if (response.count == 0){
          this.displayError(this.username + ' doesn`t have any order', false)
        } else {
          this.orderComponent = ShortOrderInformationComponent
          this.orderInjectors = new Array<Injector>()
          const orders = JSON.parse(response.orders)
          this.redirecting.checkPagesExists(orders.length, response.count, ORDER_SIZE)
          orders.forEach((order: any) => {
            this.orderInjectors.push(Injector.create([{provide: OrderInformation,
              useValue: {id: order.id_order, date: order.date_order, status: order.status}}], this.injector))
          });
        }
      }, (error) => {
        console.log(error.error.message)
      })
    }
    })
  }

  displayError(message: string, type: boolean){
    this.hasMessage = true
    this.messageComponent = BaseErrorComponent
    this.messageInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: type}}], this.injector)
  }

  resolveParams(){
    return new Promise<void>((resolve) => {
      this.redirecting.getRoute().queryParams.subscribe((params: any) => {
        if (params['page']) this.redirecting.page = parseInt(params['page'])
        if (params['success']) {
          const success = params['success']
          if (success == 'true') this.displayError('New order was added', true)
        }
        if (params['delete'] == 'true') this.displayError('Order was successfully canceled', true)
        resolve()
      })
    })
  }

  ordersByUserRequest(){
    return this.http.get('/order_for_login_user/' + this.redirecting.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  ordersByUsernameRequest(){
    return this.http.get('/order_for_login_user/' + this.username + '/' + this.redirecting.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  newOrder(){
    this.redirecting.redirect('/shopping_cart', null)
  }
}
