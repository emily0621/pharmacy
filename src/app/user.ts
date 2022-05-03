import { Injectable } from "@angular/core";
import { Role } from "./role";

@Injectable({
  providedIn: 'root',
})
export class User{
  public access_token: any;
  public refresh_token: any;
  public role: Role

  constructor(){
    this.role = Role.guest
  }

  setUser(access_token: string | null, refresh_token: string | null, role: Role){
    this.access_token = access_token
    this.refresh_token = refresh_token
    this.role = role
  }

  public printUser(){
    console.log("User...... \nrole: ", this.role,
     ",\naccess_token: ", this.access_token, ",\nrefresh_token: ", this.refresh_token)
  }
}
