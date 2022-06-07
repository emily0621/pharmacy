import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Information } from 'src/app/admin/users/users.component';
import { RedirectingService } from 'src/app/redirecting.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  @HostListener('click')
  navigateToUser(){
    console.log('event')
    console.log(this.username)
    this.redirecting.redirect('/user_page/' + this.username, null)
  }

  username: string
  nameFields: Array<string>
  valueFields: Array<string>

  constructor(
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private redirecting: RedirectingService
    ){
    console.log(injector.get(Information))
    this.nameFields = injector.get(Information).properties
    const values = injector.get(Information).values
    this.username = values[0]
    this.valueFields = values
  }

  ngOnInit(): void {
  }

}
