import { Component, Injector, OnInit } from '@angular/core';
import { Information } from 'src/app/admin/users/users.component';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  nameFields: Array<string>;
  valueFields: Array<string> = ['username', 'firstname', 'lastname', 'email', 'phone', 'date']

  constructor(private injector: Injector){
    console.log(injector.get(Information))
    this.nameFields = injector.get(Information).properties
    this.valueFields = injector.get(Information).values
  }

  ngOnInit(): void {
  }

}
