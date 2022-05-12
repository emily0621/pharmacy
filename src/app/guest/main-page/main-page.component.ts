import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, Inject, Injector, OnInit, ReflectiveInjector, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleMedicineComponent } from 'src/app/components/medicine/simple-medicine/simple-medicine.component';

export class InputValuesIntoSimpleMedicine {
  id: number
  image: string
  name: string
  price: string | null = null
  available: boolean | null = null

  constructor(id: number, image: string, name:string, price: string | null = null, available: number | null = null){
    this.id = id
    this.image = image
    this.name = name
    this.price = price
    if (available != null){
      if (available == 0) this.available = false
      else this.available = true
    }
  }
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit{

  simpleMedicine: Array<Injector>
  component: Type<any>;
  searchInput: string

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute
    ){}

  ngOnInit(): void {
    this.randomMedicineRequest().then((res) => {
      let response: any = res
      this.simpleMedicine = new Array<any>()
      console.log(response)
      this.component = SimpleMedicineComponent
      response.forEach((medicine: any) => {
        let inj: Injector = Injector.create([{provide: InputValuesIntoSimpleMedicine, useValue: {id: medicine.id_medicine, image: medicine.image, name: medicine.name_medicine}}], this.injector)
        this.simpleMedicine.push(inj)
      });
    }, (error) =>{
      console.log(error.error)
    })
  }

  search(){
    let params = {
      search_field: this.searchInput,
      page: 1
    }
    this.router.navigate(['/products'], {queryParams: params, relativeTo: this.route})
  }

  randomMedicineRequest(){
    return this.http.get('/randomMedicine').toPromise()
  }

}
