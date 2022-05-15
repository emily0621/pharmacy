import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injector, OnInit, QueryList, Type, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputFieldComponent } from 'src/app/components/input-field/input-field.component';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.scss']
})
export class FindUserComponent implements OnInit {

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  @ViewChildren(InputFieldComponent) input: QueryList<InputFieldComponent>

  private usernames: Array<string> | null = null
  private firstNames: Array<string> | null = null
  private lastNames: Array<string> | null = null
  private phone: Array<string> | null = null
  private email: Array<string> | null = null
  private dateOfBirth: Array<string> | null = null
  private validDate: Array<string> = new Array<string>()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector,
    private redirecting: RedirectingService
  ) { }

  ngOnInit(): void {
  }

  find(){
    let inputValue = this.input.get(0)?.value!
    if (inputValue != null) this.usernames = inputValue.split(', ')
    inputValue = this.input.get(1)?.value!
    if (inputValue != null) this.firstNames = inputValue.split(', ')
    inputValue = this.input.get(2)?.value!
    if (inputValue != null) this.lastNames = inputValue.split(', ')
    inputValue = this.input.get(3)?.value!
    if (inputValue != null) this.email = inputValue.split(', ')
    inputValue = this.input.get(4)?.value!
    if (inputValue != null) this.phone = inputValue.split(', ')
    inputValue = this.input.get(5)?.value!
    if (inputValue != null) this.dateOfBirth = inputValue.split(' ~ ')

    console.log(this.dateOfBirth)

    if (this.validate()){
      const params = {
        username: this.usernames,
        first_name: this.firstNames,
        last_name: this.lastNames,
        phone: this.phone,
        email: this.email,
        date_of_birth: this.validDate
      }
      this.redirecting.redirect('/users/1', params)
     }
  }

  validate(){
    this.dateOfBirth?.forEach((date: string) => {
      if (!this.isDate(date)){
        console.log('Invalid date ', date)
        this.hasError = true
        this.errorComponent = BaseErrorComponent
        this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: 'Use correct date format: YYYY-MM-DD ~ YYYY-MM-DD', type: false}}], this.injector)
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
}
