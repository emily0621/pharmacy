import { Component, Inject, Injector, OnInit, Type } from '@angular/core';
import { BaseErrorComponent, ErrorMessage } from 'src/app/components/base-error/base-error.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  errorComponent: Type<any>
  errorInjector: Injector

  constructor(
    private injector: Injector
  ) { }

  ngOnInit(): void {
    this.errorComponent = BaseErrorComponent
    this.errorInjector = Injector.create([{provide: ErrorMessage,
      useValue: {message: "Not found!", type: false}}], this.injector)
  }

}
