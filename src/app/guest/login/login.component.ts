import { Component, ElementRef, Injector, OnInit, QueryList, Type, ViewChild, ViewChildren } from '@angular/core';
import { InputFieldComponent } from 'src/app/components/input-field/input-field.component';
import { HttpClient } from '@angular/common/http';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';
import { AuthService } from 'src/app/auth.service';
import { Role } from 'src/app/role';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChildren(InputFieldComponent) input:QueryList<InputFieldComponent>;

  errorComponent: Type<any>
  errorMessage: Injector
  hasError: boolean = false

  constructor(private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector) { }

  ngOnInit(): void {
  }

  login() {
      let username = this.input.get(0)?.value!
      let password = this.input.get(1)?.value!

      this.auth.loginRequest(username, password).then((res) => {
        let response: any = res;
        console.log(JSON.parse(response))
        let refresh_token = JSON.parse(response).refresh_token;
        let access_token = JSON.parse(response).access_token;
        console.log(access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('access_token', access_token)
        this.router.navigate(['/profile'], {relativeTo: this.route})
      }, (error) => {
        this.hasError = true
        this.errorComponent = BaseErrorComponent
        this.errorMessage = Injector.create([{provide: ErrorMessage, useValue: {message: error.error.message, type: false}}], this.injector)
      })
    }
}
