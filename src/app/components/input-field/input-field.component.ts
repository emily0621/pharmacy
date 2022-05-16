import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {

  ngOnInit(): void {
  }

  @Input() name_field : string = '';
  @Input() type_field : string = 'text'
  @Input() placeholder: string = ''

  value : any = null;

  numberValue(){
    console.log("Value: ", this.value)
    if (this.value == null) this.value = this.placeholder
    return this.value
  }

}
