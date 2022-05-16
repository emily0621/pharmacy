import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RedirectingService } from 'src/app/redirecting.service';
import { Role } from 'src/app/role';
import { BaseErrorComponent, ErrorMessage } from '../../base-error/base-error.component';

export class Medicine{
  id: number
  category: number
  manufacturer: string
  price: string
  stockNumber: string
  image: string
  description: string

  constructor(
    id: number,
    category: number,
    manufacturer: string,
    price: string,
    stockNumber: string,
    image: string,
    description: string
    ){
      this.id = id
      this.category = category
      this.manufacturer = manufacturer
      this.price = price
      this.stockNumber = stockNumber
      this.image = image
      this.description = description
  }
}

@Component({
  selector: 'app-single-medicine',
  templateUrl: './single-medicine.component.html',
  styleUrls: ['./single-medicine.component.scss']
})
export class SingleMedicineComponent implements OnInit {

  category: string = "category"
  manufacturer: string = "manufacturer"
  price: string = "price"
  stockNumber: string = "10"
  image: string = "/assets/medsImg/1.png"
  description: string

  hasMessage: boolean = false
  messageComponent: Type<any>
  messageInjector: Injector

  id: number

  role: string

  constructor(
    private redirecting: RedirectingService,
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    medicine: Medicine
    ) {
    this.auth.checkRole().then((response: any) => {
      this.role = response
      console.log("ROLE ", this.role)
      this.nameCategory(medicine.category).then((response: any) => {
        this.category = response.name_category
        this.manufacturer = medicine.manufacturer
        this.price = medicine.price + '$'
        this.stockNumber = medicine.stockNumber
        this.image = '/static/images/medsImg/' + medicine.image + '.png'
        this.description = medicine.description
        this.id = medicine.id
      })
    })
   }

  ngOnInit(): void {
  }

  nameCategory(id: number){
    return this.http.get('/category/' + id).toPromise()
  }

  login(){
    this.router.navigate(['/login'], {relativeTo: this.route})
  }

  shoppingCart(){
    this.auth.checkUser().then(() => {
      this.addToShoppingCartRequest(this.id).then(() => {
        this.displayError("Successfully added to shopping cart", true)
      }, (error) => {
        this.displayError(error.error.message, false)
      })
    })
  }

  wishList(){
    this.auth.checkUser().then(() => {
      this.addToWishListRequest(this.id).then(() => {
        this.displayError("Successfully added to wish list", true)
      }, (error) => {
        this.displayError(error.error.message, false)
      })
    })
  }

  deleteMedicine(){
    this.auth.checkUser().then(() => {
      this.deleteMedicineRequest(this.id).then((response) => {
        this.productsPage({deleted: true})
      }, (error) => {
        this.productsPage({deleted: false})
      })
    })
  }

  displayError(message: string, type: boolean){
    this.hasMessage = true
    this.messageComponent = BaseErrorComponent
    this.messageInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: type}}], this.injector)
  }

  addToWishListRequest(id: number){
    return this.http.post("/wish_list/" + id, null, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  addToShoppingCartRequest(id: number){
    return this.http.post("/shopping_cart/" + id, null, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  deleteMedicineRequest(id: number){
    return this.http.delete("/medicine/" + id, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  productsPage(params: any){
    this.redirecting.redirect('/products/1', params)
  }
}
