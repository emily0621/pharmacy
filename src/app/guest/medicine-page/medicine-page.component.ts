import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medicine, SingleMedicineComponent } from 'src/app/components/medicine/single-medicine/single-medicine.component';

@Component({
  selector: 'app-medicine-page',
  templateUrl: './medicine-page.component.html',
  styleUrls: ['./medicine-page.component.scss']
})
export class MedicinePageComponent implements OnInit {

  name: string = "name"
  id: number

  medicineInjector: Injector
  medicineComponent: Type<any>

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => { this.id = param.id })
    this.getMedicineById(this.id).then((response: any) => {
      this.name = response.name_medicine
      this.medicineInjector = Injector.create([{provide: Medicine, useValue: {
        id: response.id_medicine,
        category: response.category_id,
        manufacturer: response.manufacturer,
        price: response.price,
        stockNumber: response.stock_number,
        image: response.image,
        description: response.description
      }}], this.injector)
      this.medicineComponent = SingleMedicineComponent
    }, (error) => {
      console.log(error.error.message)
      this.router.navigate(['/not_found'], {relativeTo: this.route})
    })
  }

  getMedicineById(id: number){
    return this.http.get("/medicine/" + id).toPromise()
  }



}
