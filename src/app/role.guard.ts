import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Role } from './role';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router : Router,
    private route: ActivatedRoute){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    return new Observable<boolean>((observer) => {
      this.auth.checkUser().then((user) => {
        console.log("USER access_token from guard: ")
        console.log(JSON.stringify(user.access_token))
        let roles = next.data["roles"] as Array<Role>;
        console.log(user.role)
        for (let i = 0; i < roles.length; i++){
          if (roles[i] == user.role) {
            observer.next(true);
            return
          }
        }
        if (user.role == Role.guest) this.router.navigate(['/login'], {relativeTo: this.route})
        if (user.role == Role.loginUser || user.role == Role.provisor) this.router.navigate(['/profile'], {relativeTo: this.route})
        observer.next(false)
      })
    })
  }
}
