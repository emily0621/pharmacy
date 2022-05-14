import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { InputValuesIntoSimpleMedicine, SimpleMedicineComponent } from 'src/app/components/medicine/simple-medicine/simple-medicine.component';
import { MEDICINE_SIZE, RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-medicine-in-order',
  templateUrl: './medicine-in-order.component.html',
  styleUrls: ['./medicine-in-order.component.scss']
})
export class MedicineInOrderComponent implements OnInit {

  id: number
  medicineComponent: Type<any>
  medicineInjector: Array<Injector>

  constructor(
    public redirecting: RedirectingService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function() {
    //   return false;
    // };
    this.route.params.subscribe((param: any) => {
      this.id = param.id
      this.redirecting.initPages(param.page)
    })
  }

  ngOnInit(): void {
    this.medicineInOrderRequest().then((response: any) => {
      console.log(response)
      let medicines = JSON.parse(response.medicine)
      this.redirecting.checkPagesExists(medicines.length, response.count, MEDICINE_SIZE)
      this.medicineComponent = SimpleMedicineComponent
      this.medicineInjector = new Array<Injector>()
      medicines.forEach((medicine: any) => {
        console.log(medicine)
        this.medicineInjector.push(Injector.create([
          {provide: InputValuesIntoSimpleMedicine,
          useValue: {id: medicine.id_medicine, image: medicine.image,
            name: medicine.name_medicine, price: medicine.price,
            available: medicine.stock_number}}], this.injector))
      });
    }, (error) => {
      console.log(error.error.message)
      this.redirecting.sendNotFound()
    })
  }

  // previousPage(){
  //   this.page = this.page - 1
  //   this.redirecting.redirect('/medicine/order/' + this.id, {page: this.page})
  // }

  // hasPrevPage(){
  //   if (this.page != 1) this.hasPrev = true
  //   else this.hasPrev = false
  // }

  // nextPage(){
  //   this.page = this.page + 1
  //   this.redirecting.redirect('/medicine/order/' + this.id, {page: this.page})
  // }

  // hasNextPage(){
  //   console.log(this.currentCount, this.count)
  //   if ((this.page - 1) * 9 + this.currentCount == this.count) this.hasNext = false
  //   else this.hasNext = true
  // }

  medicineInOrderRequest(){
    return this.http.get('/medicine_in_order/' + this.id + '/' + this.redirecting.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
