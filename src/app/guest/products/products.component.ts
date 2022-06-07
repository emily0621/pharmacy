import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputValuesIntoSimpleMedicine, SimpleMedicineComponent } from 'src/app/components/medicine/simple-medicine/simple-medicine.component';
import { MEDICINE_SIZE, RedirectingService } from 'src/app/redirecting.service';
import { Role } from 'src/app/role';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  showFilter = false;
  manufacturers: Array<any>
  categories: Array<any>
  orders: Array<string> = new Array<string>('price', 'manufacturer', 'category')

  selectedManufacturers: Array<string> | null = null
  selectedCategories: Array<string> | null = null
  selectedOrder: string = 'price'
  searchField: string | null = null
  available: boolean

  simpleMedicine: Array<Injector>
  medicine: Array<any>
  component: Type<any>

  messageComponent: Type<any>
  messageInjector: Injector

  deleteComponent: Type<any>
  deleteInjector: Injector
  afterDelete: boolean = false
  delete: string | null = null

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private route: ActivatedRoute,
    public redirecting: RedirectingService
    )
    {
      this.route.params.subscribe((param: any) => {
        this.redirecting.baseUrl = this.redirecting.getRouter().url.split('?')[0]
        this.redirecting.initPages(param.page)
      })
    }

  ngOnInit(): void {
    this.available = false
    this.component = SimpleMedicineComponent
    this.getCategoriesRequest().then((response: any) => {
      this.categories = response
    })
    this.getManufacturersRequest().then((response: any) => {
      this.manufacturers = response
    })
    this.resolveParams().then(() => {
      this.checkDelete()
      let data = {
        'name_medicine': this.searchField,
        'categories': this.selectedCategories,
        'manufacturers': this.selectedManufacturers,
        'available': this.available,
        'sort': this.selectedOrder,
        'page': this.redirecting.page
      }
      console.log("data", data)
      this.getSearchMedicineRequest(data).then((response: any) => {
        if (response.count == 0) this.displayError()
        else {
          this.medicine = JSON.parse(response.medicines)
          this.redirecting.checkPagesExists(this.medicine.length, response.count, MEDICINE_SIZE)
          this.simpleMedicine = new Array<Injector>()
          this.medicine.forEach((medicine: any) => {
            let inj: Injector = Injector.create([{provide: InputValuesIntoSimpleMedicine, useValue: {id: medicine.id_medicine, image: medicine.image, name: medicine.name_medicine, price: medicine.price, available: medicine.stock_number}}], this.injector)
            console.log(inj.get(InputValuesIntoSimpleMedicine))
            this.simpleMedicine.push(inj)
          })
        }
      }, (error) => {
        console.log(error.error)
        this.redirecting.sendNotFound()
      })
    })
  }

  checkDelete(){
    this.auth.checkUser().then(() => {
      if (this.auth.getUser().role == Role.provisor && this.delete != null){
        console.log(this.delete)
        console.log(typeof(this.delete))
        this.afterDelete = true
        this.deleteComponent = BaseErrorComponent
        let values
        if (this.delete === 'true') values = {message: 'Successfully deleted', type: true}
        else values = {message: 'Something went wrong. Not deleted.', type: false}
        this.deleteInjector = Injector.create([{provide: ErrorMessage, useValue: values}], this.injector)
        console.log(this.deleteInjector.get(ErrorMessage))
      }
    })
  }

  resolveParams(){
    return new Promise<void>((resolve) => {
      this.route.queryParams.subscribe((params: any) => {
        this.redirecting.queryParams = params
        if (params['category']) this.selectedCategories = params['category']
        if (params['manufacturer']) this.selectedManufacturers = params['manufacturer']
        if (params['search_field']) this.searchField = params['search_field']
        if (params['order']) this.selectedOrder = params['order']
        if (params['deleted']) this.delete = params['deleted']
        if (params['available']) {
          if (params['available'] == 'true')
          this.available = true
        }
        resolve()
      })
    })
  }

  newSearch(){
    this.search()
  }

  search(){
    console.log("SEARCH")
    let params = {
      category: this.selectedCategories,
      manufacturer: this.selectedManufacturers,
      order: this.selectedOrder,
      search_field: this.searchField,
      available: this.available,
    }
    this.redirecting.redirect('/products/1', params)
  }

  displayError(){
    this.messageComponent = BaseErrorComponent
    this.messageInjector = Injector.create([{provide: ErrorMessage, useValue: {message: 'Medicine not found', type: false}}], this.injector)
    console.log(this.messageInjector.get(ErrorMessage))
  }

  check(){
    this.showFilter = !this.showFilter;
  }

  changeAvailable(){
    this.available = !this.available
  }

  getCategoriesRequest(){
    return this.http.get('/categories').toPromise()
  }

  getManufacturersRequest(){
    return this.http.get('/manufacturers').toPromise()
  }

  getSearchMedicineRequest(data: any){
    return this.http.post('/search/medicine', data).toPromise()
  }

}
