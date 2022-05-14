import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { InputValuesIntoSimpleMedicine, SimpleMedicineComponent } from 'src/app/components/medicine/simple-medicine/simple-medicine.component';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-medicine-in-order',
  templateUrl: './medicine-in-order.component.html',
  styleUrls: ['./medicine-in-order.component.scss']
})
export class MedicineInOrderComponent implements OnInit {

  hasNext: boolean
  hasPrev: boolean
  page: number = 1
  id: number
  count: number
  currentCount: number

  medicineComponent: Type<any>
  medicineInjector: Array<Injector>

  constructor(
    private redirecting: RedirectingService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit(): void {
    this.resolveParams().then(() => {
      this.medicineInOrderRequest().then((response: any) => {
        console.log(response)
        this.count = response.count
        let medicines = JSON.parse(response.medicine)
        this.currentCount = medicines.length
        this.hasNextPage()
        this.hasPrevPage()
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
    })
  }

  resolveParams(){
    this.route.params.subscribe((param: any) => { this.id = param.id })
    return new Promise<void>((resolve) => {
      this.route.queryParams.subscribe((params: any) => {
        if (params['page']) this.page = parseInt(params['page'])
        resolve()
      })
    })
  }

  previousPage(){
    this.page = this.page - 1
    this.redirecting.redirect('/medicine/order/' + this.id, {page: this.page})
  }

  hasPrevPage(){
    if (this.page != 1) this.hasPrev = true
    else this.hasPrev = false
  }

  nextPage(){
    this.page = this.page + 1
    this.redirecting.redirect('/medicine/order/' + this.id, {page: this.page})
  }

  hasNextPage(){
    console.log(this.currentCount, this.count)
    if ((this.page - 1) * 9 + this.currentCount == this.count) this.hasNext = false
    else this.hasNext = true
  }

  medicineInOrderRequest(){
    return this.http.get('/medicine_in_order/' + this.id + '/' + this.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
