import { Component, Injector, OnInit } from '@angular/core';

export class ErrorMessage{
  message: string
  type: boolean

  constructor(message: string, type: boolean){
    this.message = message
    this.type = type
  }
}

@Component({
  selector: 'app-base-error',
  templateUrl: './base-error.component.html',
  styleUrls: ['./base-error.component.scss']
})
export class BaseErrorComponent implements OnInit {

  message: string
  class: string

  constructor(private injector: Injector) {
    this.message = injector.get(ErrorMessage).message
    if (!injector.get(ErrorMessage).type) this.class = 'error'
    else this.class = 'success'
  }

  ngOnInit(): void {
  }
}
