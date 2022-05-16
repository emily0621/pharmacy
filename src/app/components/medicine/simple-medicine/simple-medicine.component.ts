import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injector, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-simple-medicine',
  templateUrl: './simple-medicine.component.html',
  styleUrls: ['./simple-medicine.component.scss']
})
export class SimpleMedicineComponent implements OnInit {

  @HostListener('click')
  navigateToMedicine(){
    console.log('event')
    console.log(event)
    console.log(this.id)
    this.router.navigate(['/medicine_page/' + this.id], {relativeTo: this.route})
  }

  id: number
  image: string;
  name: string;
  price: string | null = null
  available: string | null = null

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector){
    console.log("INJECTOR: ", injector.get(InputValuesIntoSimpleMedicine))
    this.id = injector.get(InputValuesIntoSimpleMedicine).id
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
