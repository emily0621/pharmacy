import { NgComponentOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ContentChildren, InjectionToken, Injector, OnInit, QueryList, TemplateRef, Type, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { OrderMedicineComponent } from 'src/app/components/order-medicine/order-medicine.component';
import { DynamicComponentService } from 'src/app/dynamic-component.service';
import { InputValuesIntoSimpleMedicine } from 'src/app/guest/main-page/main-page.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  medicineComponent: Type<any>
  medicineInjectors: Array<Injector>

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private dynamicComponentService: DynamicComponentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.shoppingCartRequest().then((response: any) => {
      this.medicineComponent = OrderMedicineComponent
      this.medicineInjectors = new Array<Injector>()
      response.forEach((medicine: any) => {
        this.medicineInjectors.push(Injector.create([{provide: Number, useValue: medicine.id_medicine}], this.injector))
      });
    }, (error) => {
      console.log(error.error.message)
    })
  }

  makeOrder(){
    this.dynamicComponentService.clearData()
    this.dynamicComponentService.toggleMakeOrder()
    console.log(this.dynamicComponentService.getData())
    this.auth.checkUser().then(() => {
      let medicine = new Array<number>()
      let count = new Array<number>()
      this.dynamicComponentService.data.forEach(med => {
        medicine.push(med.id)
        count.push(med.count)
      });
      let data = {medicine: medicine, count: count}
      this.makeOrderRequest(data).then((response: any) => {
        console.log(response)
        this.router.navigate(['/user_orders'], {queryParams: {success: true}, relativeTo: this.route})
      }, (error) => {
        this.displayError(error.error.message)
        console.log(error.error.message)
      })
    })
  }

  displayError(message: string){
    this.hasError = true
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage,
      useValue: {message: message, type: false}}], this.injector)
  }

  shoppingCartRequest(){
    return this.http.get('/medicine_from_shopping_cart', {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  makeOrderRequest(body: any){
    return this.http.post('/make_order', body, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
