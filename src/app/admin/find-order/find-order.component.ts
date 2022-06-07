import { Component, Injector, OnInit, QueryList, Type, ViewChildren } from '@angular/core';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputFieldComponent } from 'src/app/components/input-field/input-field.component';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-find-order',
  templateUrl: './find-order.component.html',
  styleUrls: ['./find-order.component.scss']
})
export class FindOrderComponent implements OnInit {

  @ViewChildren(InputFieldComponent) input: QueryList<InputFieldComponent>

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  validDate: Array<string> = new Array()
  date: Array<string> = new Array()
  username: Array<string> = new Array()
  medicine: Array<string> = new Array()
  price: Array<string> = new Array()
  status: Array<string> = new Array()

  constructor(
    private injector: Injector,
    private redirecting: RedirectingService
  ) {}

  ngOnInit(): void {
  }

  find(){
    this.hasError = false
    if (this.input.get(0)?.value != null) this.date = this.input.get(0)?.value.split(' ~ ')
    if (this.input.get(1)?.value != null) this.username = this.input.get(1)?.value.split(', ')
    if (this.input.get(2)?.value != null) this.medicine = this.input.get(2)?.value.split(', ')
    if (this.input.get(3)?.value != null) this.price = this.input.get(3)?.value.split(' - ')
    console.log(this.input)
    console.log(
      this.date,
      this.medicine,
      this.username,
      this.price,
      this.status
    )
    if (this.validation()) {
      if (this.status.length == 0) this.status = new Array("canceled", "complete", "delivered", "in the process of delivery", "is being prepared", "ready to ship")
      const params = {
        date: this.validDate,
        username: this.username,
        medicine: this.medicine,
        price: this.price,
        status: this.status
      }
      this.redirecting.redirectWithReload('/orders/1', params)
    }
  }

  validation(){
    let valid = true
    if (this.date.length != 0){
      if (!this.validateDate()) valid = false
    }
    if (valid && this.price.length != 0) {
      if (!this.validatePrice()) valid = false
    }
    return valid
  }

  validatePrice(){
    const error: string = 'Use correct price format: ">{number}", "<{number}" or "{number1} - {number2}"'
    if (this.price.length == 1){
      const sign = this.price[0][0]
      if (sign !== '<' && sign !== '>'){
        this.displayError(error)
        return false
      } else {
        const temp = new Array<string>(sign, this.price[0].slice(1, this.price[0].length))
        this.price = temp
      }
    } else if (this.price.length == 2){
      if (this.price[1] < this.price[0]) {
        this.displayError('Price 2 must be greater then price 1')
        return false
      }
    } else {
      this.displayError(error)
      return false
    }
    return true
  }

  validateDate(){
    this.date.forEach((date: string) => {
      if (!this.isDate(date)){
        console.log('Invalid date ', date)
        this.displayError('Use correct date format: YYYY-MM-DD ~ YYYY-MM-DD')
      }
      else console.log('Valid date ', date)
    })
    if (this.hasError) return false
    return true
  }

  isDate(dateOfBirth: string){
    let date = dateOfBirth.split('-')
    let correctDateFormat: string = ''
    if (date.length != 3) return false
    if (date[0].length == 2 && date[1].length == 2 && date[2].length == 4) {
      correctDateFormat = date[2] + '-' + date[1] + '-' + date[0]
      let dateDate: Date = new Date(correctDateFormat)
      if (dateDate.toDateString() == 'Invalid Date') return false
      else this.validDate?.push(correctDateFormat)
    }
    if (date[0].length == 4 && date[1].length == 2 && date[2].length == 2) {
      correctDateFormat = date[0] + '-' + date[1] + '-' + date[2]
      let dateDate: Date = new Date(correctDateFormat)
      if (dateDate.toDateString() == 'Invalid Date') return false
      else this.validDate?.push(correctDateFormat)
    }
    return true
  }

  displayError(message: string){
    this.hasError = true
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: false}}], this.injector)

  }

}
