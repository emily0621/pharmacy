import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputValuesIntoSimpleMedicine, SimpleMedicineComponent } from 'src/app/components/medicine/simple-medicine/simple-medicine.component';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {

  hasNext: boolean
  hasPrev: boolean

  showFilter = false;

  count: number = 0
  currentCount: number
  page: number = 1

  simpleMedicine: Array<Injector>
  medicine: Array<any>
  component: Type<any>

  messageComponent: Type<any>
  messageInjector: Injector

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private redirecting: RedirectingService
    )
    {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
    }

  ngOnInit(): void {
    this.resolveParams().then(() => {
      this.wishList().then((response: any) => {
        this.component = SimpleMedicineComponent
        console.log(response)
        if (response.count == 0) this.displayError()
        else {
          this.count = response.count
          this.medicine = JSON.parse(response.medicine)
          this.currentCount = this.medicine.length
          this.hasNextPage()
          this.hasPreviousPage()
          this.simpleMedicine = new Array<Injector>()
          this.medicine.forEach((medicine: any) => {
            console.log(medicine)
            let inj: Injector = Injector.create([{provide: InputValuesIntoSimpleMedicine, useValue: {id: medicine.id_medicine, image: medicine.image, name: medicine.name_medicine, price: medicine.price, available: medicine.stock_number}}], this.injector)
            console.log(inj.get(InputValuesIntoSimpleMedicine))
            this.simpleMedicine.push(inj)
          })
          this.hasPreviousPage()
          this.hasNextPage()
        }
      })
    })
  }

  resolveParams(){
    return new Promise<void>((resolve) => {
      this.route.queryParams.subscribe((params: any) => {
        if (params['page']) this.page = parseInt(params['page'])
        resolve()
      })
    })
  }

  wishList(){
    console.log(this.auth.getUser().access_token)
    return this.http.get("/medicine_from_wish_list/" + this.page, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  medicinePage(event: any){
    console.log("click")
    console.log(event)
  }

  displayError(){
    this.messageComponent = BaseErrorComponent
    this.messageInjector = Injector.create([{provide: ErrorMessage, useValue: {message: 'Your wish list is empty', type: false}}], this.injector)
    console.log(this.messageInjector.get(ErrorMessage))
  }

  hasPreviousPage(){
    if (this.page != 1) this.hasPrev = true
    else this.hasPrev = false
  }

  previousPage(){
    this.page = this.page - 1
    this.redirecting.redirect('/wish_list', {page: this.page})
  }

  hasNextPage(){
    if ((this.page - 1) * 9 + this.medicine.length == this.count) this.hasNext = false
    else this.hasNext = true
  }

  nextPage(){
    this.page = this.page + 1
    console.log(this.page)
    this.redirecting.redirect('/wish_list', {page: this.page})
  }
}
