import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  data: Array<any>
  makeOrder: boolean = false
  makeOrderChange: Subject<boolean> = new Subject<boolean>();

  constructor() {

  }

  async addData(data: any){
    this.data.push(data)
  }

  toggleMakeOrder() {
    this.makeOrderChange.next(!this.makeOrder);
  }

  getData(){
    this.toggleMakeOrder()
    return this.data
  }

  clearData(){
    this.data = new Array()
    console.log(this.data)
  }
}
