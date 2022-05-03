import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { InputValuesIntoSimpleMedicine } from 'src/app/guest/main-page/main-page.component';

@Component({
  selector: 'app-simple-medicine',
  templateUrl: './simple-medicine.component.html',
  styleUrls: ['./simple-medicine.component.scss']
})
export class SimpleMedicineComponent implements OnInit {

  image: string;
  name: string;
  price: string | null = null
  available: string | null = null

  constructor(private injector: Injector){
    console.log(injector.get(InputValuesIntoSimpleMedicine))
    this.image = '/static/images/medsImg/' + injector.get(InputValuesIntoSimpleMedicine).image + '.png'
    this.name = injector.get(InputValuesIntoSimpleMedicine).name
    if (injector.get(InputValuesIntoSimpleMedicine).price == undefined) this.price = null
    else this.price = injector.get(InputValuesIntoSimpleMedicine).price

    if (injector.get(InputValuesIntoSimpleMedicine).available == undefined) this.available = null
    else if (injector.get(InputValuesIntoSimpleMedicine).available) this.available = 'Available'
    else this.available = 'Not available'
  }

  ngOnInit(): void {
  }
}
