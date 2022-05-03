import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-information-field',
  templateUrl: './information-field.component.html',
  styleUrls: ['./information-field.component.scss',
  '../input-field/input-field.component.scss']
})
export class InformationFieldComponent implements OnInit {

  @Input() name_field : string;
  @Input() value_field : string;

  constructor() { }

  ngOnInit(): void {
  }

}
