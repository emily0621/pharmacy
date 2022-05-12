import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { OrderInformation, ShortOrderInformationComponent } from 'src/app/components/short-order-information/short-order-information.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  hasSuccess: boolean = false

  hasNext: boolean = false
  hasPrev: boolean = false

  orderComponent: Type<any>
  orderInjectors: Array<Injector>
  page: number = 1
  count: number
  currentCount: number

  hasMessage : boolean = false
  messageComponent: Type<any>
  messageInjector: Injector

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit(): void {
    this.resolveParams().then(() => {
      this.ordersByUserRequest().then((response: any) => {
        if (response.count == 0){
          this.displayError('You don`t have any order', false)
        } else {
          this.orderComponent = ShortOrderInformationComponent
          this.orderInjectors = new Array<Injector>()
          const orders = JSON.parse(response.orders)
          this.count = response.count
          this.currentCount = orders.length
          this.hasNextPage()
          this.hasPrevPage()
          orders.forEach((order: any) => {
            this.orderInjectors.push(Injector.create([{provide: OrderInformation,
              useValue: {id: order.id_order, date: order.date_order, status: order.status}}], this.injector))
          });
        }
        console.log(response)
      }, (error) => {
        console.log(error.error.message)
      })
    })
  }

  displayError(message: string, type: boolean){
    this.hasMessage = true
    this.messageComponent = BaseErrorComponent
    this.messageInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: type}}], this.injector)
  }

  resolveParams(){
    return new Promise<void>((resolve) => {
      this.route.queryParams.subscribe((params: any) => {
        if (params['page']) this.page = parseInt(params['page'])
        if (params['success']) {
          const success = params['success']
          if (success == 'true') {
            this.hasSuccess = true
            this.displayError('New order was added', true)
          }
        }
        resolve()
      })
    })
  }

  previousPage(){
    this.page = this.page - 1
    this.router.navigate(['/user_orders'], {queryParams: {page: this.page}, relativeTo: this.route})
  }

  hasPrevPage(){
    if (this.page != 1) this.hasPrev = true
    else this.hasPrev = false
  }

  nextPage(){
    this.page = this.page + 1
    this.router.navigate(['/user_orders'], {queryParams: {page: this.page}, relativeTo: this.route})
  }

  hasNextPage(){
    console.log(this.currentCount, this.count)
    if ((this.page - 1) * 6 + this.currentCount == this.count) this.hasNext = false
    else this.hasNext = true
  }

  ordersByUserRequest(){
    return this.http.get('/order_for_login_user/' + this.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  newOrder(){
    this.router.navigate(['/shopping_cart'], {relativeTo: this.route})
  }

}
