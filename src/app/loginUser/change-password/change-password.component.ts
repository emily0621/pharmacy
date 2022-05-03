import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, QueryList, Type, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { InputFieldComponent } from 'src/app/components/input-field/input-field.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  hasError: boolean = false
  errorComponent: Type<any>
  errorInjector: Injector

  @ViewChildren(InputFieldComponent) input:QueryList<InputFieldComponent>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private injector: Injector) { }

  ngOnInit(): void {
  }

  validate(): boolean{
    let old_password = this.input.get(0)?.value!
    let new_password = this.input.get(1)?.value!
    let confirmed_password = this.input.get(2)?.value!
    console.log(new_password, confirmed_password)
    if (old_password == null || new_password == null || confirmed_password == null){
      this.displayError('All fields are required')
      return false
    }
    if (new_password != confirmed_password) {
      this.displayError('New password and confirmed password don`t match')
      return false
    }
    if (new_password.length < 8) {
      this.displayError('Password mast contain at least 8 characters')
      return false
    }
    return true
  }

  displayError(message: string){
    this.hasError = true
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage, useValue: {message: message, type: false}}], this.injector)
  }

  change(){
    if (this.validate()) {
      let data = {
        old_password: this.input.get(0)?.value!,
        new_password: this.input.get(1)?.value!
      }
      this.auth.checkUser().then(() => {
        this.changePasswordRequest(data).then((res) => {
          let params = {
            password: 'success'
          }
          this.router.navigate(['/profile'], {queryParams: params, relativeTo: this.route})
        }, (error) => {
          this.displayError(error.error.message)
        })
      })
    }
  }

  cancel(){
    this.router.navigate(['/profile'], {relativeTo: this.route})
  }

  changePasswordRequest(data: any){
    return this.http.post('/changeUserPassword', data, {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }

}
