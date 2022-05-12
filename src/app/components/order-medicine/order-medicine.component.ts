import { HttpClient } from '@angular/common/http';
import { Component, ComponentRef, EventEmitter, HostListener, Injector, OnChanges, OnInit, Output, SimpleChanges, Type, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DynamicComponentService } from 'src/app/dynamic-component.service';
import { InputValuesIntoSimpleMedicine } from 'src/app/guest/main-page/main-page.component';
import { InputFieldComponent } from '../input-field/input-field.component';
import { SimpleMedicineComponent } from '../medicine/simple-medicine/simple-medicine.component';

@Component({
  selector: 'app-order-medicine',
  templateUrl: './order-medicine.component.html',
  styleUrls: ['./order-medicine.component.scss']
})
export class OrderMedicineComponent implements OnInit {

  @ViewChild(InputFieldComponent) input: InputFieldComponent

  medicineComponent: Type<any>
  medicineInjector: Injector

  id: number
  @Output()
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

  fillInDynamicComponent(){
    if (this.checkedMedicine) {
      this.dynamicComponentService.addData({id: this.id, count: this.input.numberValue()})
    }
  }

  medicineById(){
    return this.http.get('/medicine/' + this.id).toPromise()
  }

}
