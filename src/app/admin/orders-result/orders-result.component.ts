import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { OrderInformation, ShortOrderInformationComponent } from 'src/app/components/short-order-information/short-order-information.component';
import { ORDER_SIZE, RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-orders-result',
  templateUrl: './orders-result.component.html',
  styleUrls: ['./orders-result.component.scss']
})
export class OrdersResultComponent implements OnInit {

  orderComponent: Type<any>
  orderInjectors: Array<Injector> = new Array<Injector>()

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  date: Array<string> = new Array()
  username: Array<string> = new Array()
  medicine: Array<string> = new Array()
  price: Array<string> = new Array()
  status: Array<string> = new Array()

  constructor(
    public redirecting: RedirectingService,
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param: any) => {
      this.redirecting.initPages(param.page)
      this.redirecting.baseUrl = this.redirecting.getRouter().url.split('?')[0]
    })
  }

  ngOnInit(): void {
    this.resolveParams()
    const data = {
      date: this.date,
      username: this.username,
      medicine: this.medicine,
      price: this.price,
      status: this.status
    }
    this.findOrder(data).then((response: any) => {
      console.log(response)
      this.redirecting.checkPagesExists(response.orders.length, response.count, ORDER_SIZE)
      this.orderComponent = ShortOrderInformationComponent
      response.orders.forEach((order: any) => {
        this.orderInjectors.push(Injector.create([{provide: OrderInformation,
          useValue: {id: order.id_order, date: order.date_order, status: order.status}}], this.injector))
      });
    }, (error) => {
      this.hasError = true
      this.errorComponent = BaseErrorComponent
      this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: error.error.message, type: false}}], this.injector)
    })
  }

  resolveParams(){
    return this.route.queryParams.subscribe((params: any) => {
      console.log(params)
      this.redirecting.queryParams = params
      if (params['date']) this.date = this.asArray(params['date'])
      if (params['username']) this.username = this.asArray(params['username'])
      if (params['medicine']) this.medicine = this.asArray(params['medicine'])
      if (params['price']) this.price = this.asArray(params['price'])
      if (params['status']) this.status = this.asArray(params['status'])
      console.log(typeof(params['status']))
    })
  }

  asArray(params: any){
    if (typeof(params) == 'string') return new Array(params)
    else return params
  }

  findOrder(data: any){
    return this.http.post('/find_order/' + this.redirecting.page, data, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }
}
