import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { DynamicComponentService } from 'src/app/dynamic-component.service';
import { Role } from 'src/app/role';

export class Message{
  message: any
  classMessage: string
  toUser: string

  constructor(message: any, classMessage: string, toUser: string){
    this.message = message
    this.classMessage = classMessage
    this.toUser = toUser
  }

}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {

  @HostListener('click')
  navigateToMedicine(){
    if (this.auth.getUser().role == Role.provisor && this.fromUser != 'admin'){
      this.select()
    }
  }

  text: string
  class: string
  fromUser: string
  selected: boolean = false

  constructor(
    private message: Message,
    private auth: AuthService,
    private dynamicComponentService: DynamicComponentService) {
      this.text = message.message.message
      this.class = message.classMessage
      this.fromUser = message.message.from
      dynamicComponentService.makeOrderChange.subscribe((value) => {
        dynamicComponentService.makeOrder = value
        if (dynamicComponentService.makeOrder == true) {
          this.fillInDynamicComponent()
        }
      })
  }

  ngOnInit(): void {
  }

  select(){
    console.log({text: this.text, from: this.fromUser})
    if (!this.selected && this.class == 'received_message'){
      this.class = 'own_message'
    } else if (this.selected && this.class == 'own_message') {
      this.class = 'received_message'
    }
    this.selected = !this.selected
  }

  fillInDynamicComponent(){
    console.log(this.selected, this.text)
    if (this.selected) {
      this.dynamicComponentService.addData(this.message.message)
      this.select()
    }
  }
}
