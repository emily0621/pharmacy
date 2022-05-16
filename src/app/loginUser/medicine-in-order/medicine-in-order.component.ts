import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
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
    this.route.params.subscribe((param: any) => {
      this.id = param.id
      this.redirecting.initPages(param.page)
      this.redirecting.baseUrl = this.redirecting.getRouter().url.split('?')[0]
    })
  }

  ngOnInit(): void {
    this.medicineInOrderRequest().then((response: any) => {
      let medicines = JSON.parse(response.medicine)
      if (medicines.length == 0){
        this.redirecting.sendNotFound()
      } else {
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
      }
    }, (error) => {
      console.log(error.error.message)
      this.redirecting.sendNotFound()
    })
  }

  medicineInOrderRequest(){
    return this.http.get('/medicine_in_order/' + this.id + '/' + this.redirecting.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
