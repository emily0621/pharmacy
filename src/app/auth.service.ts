import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, ConnectableObservable, Observable } from 'rxjs';
import { Role } from './role';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  response: any

  constructor(
    private user: User,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
    ){
  }

  async checkUser(): Promise<User>{
    return new Promise<User> ((resolve) => {
      let refresh_token = localStorage.getItem('refresh_token')
      let access_token = localStorage.getItem('access_token')
      this.user.setUser(access_token, refresh_token, Role.guest)
      if (refresh_token != null && access_token != null) {
        this.refreshAccessToken(refresh_token, access_token).then((res) => {
          this.response = res
          if (this.response != null)
          this.user.access_token = this.response.access_token
          localStorage.setItem('access_token', this.user.access_token)
          this.getRole().then((res) => {
            this.response = res
            if (this.response.role == false){
              this.user.role = Role.loginUser
            } else {
              this.user.role = Role.provisor
            }
            resolve(this.user)
          })
        })
      }
      else {
        resolve(this.user)
      }
    })
  }

  async refreshAccessToken(refresh_token: string, access_token: string){
    return this.http.post('/access_token', {'access_token': access_token}, {headers: this.getHeaders(refresh_token)}).toPromise()
  }

  checkRole(): Promise<Role>{
    return new Promise((resolve) => {
      if (this.user.access_token != null) {
        this.getRole().then((response: any) => {
          if (response.role == true) resolve(Role.provisor)
          else if (response.role == false) resolve(Role.loginUser)
        }, (error) => {})
      } else resolve(Role.guest)
    })
  }

  getRole(){
    return this.http.get('/role', {headers: this.getHeaders(this.user.access_token)}).toPromise()
  }

  loginRequest(username: string, password: string){
    return this.http.post('/login', {'username': username, 'password': password}).toPromise()
  }

  logout(){
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access_token')
  }

  getHeaders(token: string){
    return new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`})
  }

  getUser(){
    return this.user
  }
}
