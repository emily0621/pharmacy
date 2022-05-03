import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, QueryList, Type, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputFieldComponent } from 'src/app/components/input-field/input-field.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  @ViewChildren(InputFieldComponent) input:QueryList<InputFieldComponent>;

  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  validDate: string

  private update: boolean = false

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector
    ) { }

  ngOnInit(): void {
    this.getUserRequest().then((response: any) => {
      console.log(response)
      this.username = response.username
      this.firstName = response.first_name
      this.lastName = response.last_name
      this.email = response.email
      this.phone = response.phone
      this.dateOfBirth = response.date_of_birth
    })
  }

  edit(){
    console.log(this.input.get(1)?.value!)
    if (this.input.get(0)?.value! != undefined) {
      this.username = this.input.get(0)?.value!
      this.update = true
    }
    if (this.input.get(1)?.value! != undefined)this.firstName = this.input.get(1)?.value!
    if (this.input.get(2)?.value! != undefined)this.lastName = this.input.get(2)?.value!
    if (this.input.get(3)?.value! != undefined)this.email = this.input.get(3)?.value!
    if (this.input.get(4)?.value! != undefined)this.phone = this.input.get(4)?.value!
    if (this.input.get(5)?.value! != undefined)this.dateOfBirth = this.input.get(5)?.value!

    if (this.validate()) {
      let data = {
        username: this.username,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        date_of_birth: this.validDate,
        password: '',
        provisor: false
      }

      this.auth.checkUser().then(() => {
        this.updateUserRequest(data).then(() => {
          let params = {
            edit_profile: 'success'
          }
          this.router.navigate(['/profile'], {queryParams: params, relativeTo: this.route})
        }, (error) => {
          this.displayError(error.error.message)
        })
      })
    }
  }

  displayError(message: string){
    this.hasError = true
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: false}}], this.injector)
  }

  validate(){
     if (this.username.length < 5) {
       this.displayError('Username must contain at least 5 characters')
       return false
     } if (this.firstName.length < 5) {
      this.displayError('First name must contain at least 5 characters')
      return false
     } if (this.lastName.length < 5) {
      this.displayError('Last name must contain at least 5 characters')
      return false
     } if (this.email.length < 5) {
      this.displayError('Email must contain at least 5 characters')
      return false
     } if (this.phone.length < 5) {
      this.displayError('Phone must contain at least 5 characters')
      return false
     } if (!this.isDate()){
      this.displayError('Date format is incorrect. Use YYYY-MM-DD or DD-MM-YYYY')
      return false
     }
     return true
  }

  isDate(){
    let date = this.dateOfBirth.split('-')
    let correctDateFormat: string = ''
    if (date.length != 3) return false
    if (date[0].length == 2 && date[1].length == 2 && date[2].length == 4) {
      correctDateFormat = date[2] + '-' + date[1] + '-' + date[0]
      let dateDate: Date = new Date(correctDateFormat)
      if (dateDate.toDateString() == 'Invalid Date') return false
      else this.validDate = correctDateFormat
    }
    if (date[0].length == 4 && date[1].length == 2 && date[2].length == 2) {
      correctDateFormat = date[0] + '-' + date[1] + '-' + date[2]
      let dateDate: Date = new Date(correctDateFormat)
      if (dateDate.toDateString() == 'Invalid Date') return false
      else this.validDate = correctDateFormat
    }
    return true
  }

  cancel(){
    this.router.navigate(['/profile'], {relativeTo: this.route})
  }

  getUserRequest(){
    return this.http.get('/user', {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  updateUserRequest(data: any){
    return this.http.put('/user', data, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }
}
