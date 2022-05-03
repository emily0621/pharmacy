import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, QueryList, Type, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputFieldComponent } from 'src/app/components/input-field/input-field.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  hasError: boolean
  errorComponent: Type<any>
  errorInjector: Injector


  @ViewChildren(InputFieldComponent) input:QueryList<InputFieldComponent>;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector) { }

  ngOnInit(): void {
  }

  validDate: string

  register() {
    let username = this.input.get(0)?.value!
    let firstName = this.input.get(1)?.value!
    let lastName = this.input.get(2)?.value!
    let email = this.input.get(3)?.value!
    let phone = this.input.get(4)?.value!
    let dateOfBirth = this.input.get(5)?.value!
    let password = this.input.get(6)?.value!
    let confirmedPassword = this.input.get(7)?.value!

    if (this.validate(
      username,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      password,
      confirmedPassword)){
        this.registerRequest(username, firstName, lastName, email, phone, this.validDate, password)
        .then((res) => {
          console.log(res)
          this.router.navigate(['/profile'], {relativeTo: this.route})
        }, (error) => {
          this.displayError(error.error.message)
        })
    }
  }

  registerRequest(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    password: string){
    let data = {
      'username': username,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'password': password,
      'phone': phone,
      'date_of_birth': dateOfBirth,
      'provisor': false
    }
    return this.http.post('/user', data, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

  validate(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    password: string,
    confirmedPassword: string
  ){
    if (username == null || firstName == null || lastName == null ||
      email == null || phone == null || dateOfBirth == null || password == null
      || confirmedPassword == null){
        this.displayError('All fields are required')
        return false
      }
    if (username.length < 5) {
      this.displayError('Username must contain at least 5 characters')
      return false
    } if (firstName.length < 5) {
     this.displayError('First name must contain at least 5 characters')
     return false
    } if (lastName.length < 5) {
     this.displayError('Last name must contain at least 5 characters')
     return false
    } if (email.length < 5) {
     this.displayError('Email must contain at least 5 characters')
     return false
    } if (phone.length < 5) {
     this.displayError('Phone must contain at least 5 characters')
     return false
    } if (!this.isDate(dateOfBirth)){
     this.displayError('Date format is incorrect. Use YYYY-MM-DD or DD-MM-YYYY')
     return false
    } if (password != confirmedPassword) {
      this.displayError('New password and confirmed password don`t match')
      return false
    }
    if (password.length < 8) {
      this.displayError('Password mast contain at least 8 characters')
      return false
    }
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

  displayError(message: string){
    this.hasError = true
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: false}}], this.injector)
  }
}
