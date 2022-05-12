import { Component, Injector, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullOrderInformationComponent } from 'src/app/components/full-order-information/full-order-information.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  id: number
  orderComponent: Type<any>
  orderInjector: Injector

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => { this.id = param.id })
    console.log("In function: ", this.id)
    this.orderComponent = FullOrderInformationComponent
    this.orderInjector = Injector.create([{provide: Number, useValue: this.id}], this.injector)
  }

}
