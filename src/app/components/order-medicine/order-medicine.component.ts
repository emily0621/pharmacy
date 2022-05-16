import { HttpClient } from '@angular/common/http';
import { Component, ComponentRef, EventEmitter, HostListener, Injector, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DynamicComponentService } from 'src/app/dynamic-component.service';
import { InputFieldComponent } from '../input-field/input-field.component';
import { InputValuesIntoSimpleMedicine, SimpleMedicineComponent } from '../medicine/simple-medicine/simple-medicine.component';

@Component({
  selector: 'app-order-medicine',
  templateUrl: './order-medicine.component.html',
  styleUrls: ['./order-medicine.component.scss']
})
export class OrderMedicineComponent implements OnInit{

  @ViewChild(InputFieldComponent) input: InputFieldComponent

  medicineComponent: Type<any>
  medicineInjector: Injector

  id: number
  checkedMedicine: boolean = false
  count: number

  constructor(
    private number: Number,
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector,
    private dynamicComponentService: DynamicComponentService
    ) {
    this.id = number.valueOf()
    dynamicComponentService.makeOrderChange.subscribe((value) => {
      dynamicComponentService.makeOrder = value
      if (dynamicComponentService.makeOrder == true) this.fillInDynamicComponent()
    });
  }

  ngOnInit(): void {
    this.checkedMedicine = false
    this.medicineById().then((response: any) => {
      this.medicineComponent = SimpleMedicineComponent
      this.medicineInjector = Injector.create([{provide: InputValuesIntoSimpleMedicine,
      useValue: {
        id: response.id_medicine,
        image: response.image,
        name: response.name_medicine,
        price: response.price,
        available: response.stock_number
      }}], this.injector)
    })
  }

  changeSelect(){
    this.checkedMedicine = !this.checkedMedicine
  }

  fillInDynamicComponent(){
    console.log('id: ', this.id, " checked: ", this.checkedMedicine)
    if (this.checkedMedicine) {
      this.dynamicComponentService.addData({id: this.id, count: this.input.numberValue()})
    }
  }

  medicineById(){
    return this.http.get('/medicine/' + this.id).toPromise()
  }

}
