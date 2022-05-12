import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

export class OrderInformation{
  id: number
  date: string
  status: string
  constructor(id: number, date: string, status: string){
    this.id = id
    this.date = date
    this.status = status
  }
}
@Component({
  selector: 'app-short-order-information',
  templateUrl: './short-order-information.component.html',
  styleUrls: ['./short-order-information.component.scss']
})
export class ShortOrderInformationComponent implements OnInit {

  @HostListener('click')
  navigateToMedicine(){
    console.log('event')
    console.log(event)
    console.log(this.orderInformation.id)
    this.router.navigate(['/order_page/' + this.orderInformation.id], {relativeTo: this.route})
  }

  date: string = '01-01-2001'
  medicines: string = '-'
  status: string = 'in process of delivery'
  title: string = 'Order #'

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private orderInformation: OrderInformation,
    private router: Router,
    private route: ActivatedRoute,
    ) {
    this.date = orderInformation.date,
    this.status = orderInformation.status
    this.title += orderInformation.id
    this.medicineInOrderRequest(orderInformation.id).then((response: any) => {
      console.log(response)
      this.medicines = ''
      for(let i = 0; i < response.count.length; i++){
        this.medicines = this.medicines + response.medicine[i] + 'x' + response.count[i] + ', '
        if (this.medicines.length >= 50) {
          this.medicines = this.medicines.substring(0, 47) + '...'
          break;
        }
      }
      console.log(this.medicines)
    }, (error) => {
      console.log(error.error.message)
    })
  }

  ngOnInit(): void {
  }

  medicineInOrderRequest(id: number){
    return this.http.get('/medicine_from_order_with_count/' + id, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
