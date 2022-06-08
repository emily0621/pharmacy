import { Component, Injector, OnInit, Type, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { InputFieldComponent } from '../components/input-field/input-field.component';
import { Message, MessageComponent } from '../components/message/message.component';
import { User } from '../user';
import { WebSocketService } from '../web-socket.service';
import { Role } from '../role';
import { HttpClient } from '@angular/common/http';
import { DynamicComponentService } from '../dynamic-component.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.scss']
})
export class SocketComponent implements OnInit {

  @ViewChild(InputFieldComponent) input: InputFieldComponent;

  role: Role = Role.guest
  author: string
  username: string

  showChat = false
  component:  Type<any> = MessageComponent
  messagesInChat: Array<any> = new Array()
  messages: Array<any> = new Array()

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private injector: Injector,
    private webSocketService: WebSocketService,
    private dynamicComponentService: DynamicComponentService
  ) {
    this.webSocketService.listen('message').subscribe((data: any) => {
      console.log(this.author, this.username, this.role)
      this.messagesInChat.push(data)
      console.log('received message: ', data)
      this.messageToChat(data)
    })
  }

  ngOnInit(): void {
    if (this.showChat == false){
      this.auth.checkUser().then((user: User) => {
        this.role = user.role
      })
    }
  }

  messageToChat(message: any){
    console.log('message ', message)
    if (message.to == this.username || message.from == this.username){
      let classMessage
      if ((message.author == 'admin' && this.role == Role.provisor) ||
        (message.author != 'admin' && this.role != Role.provisor)) classMessage = 'own_message'
      else classMessage = 'received_message'
        const messageInjector = Injector.create([{provide: Message, useValue: {message: message, classMessage: classMessage}}], this.injector)
        this.messages.push({injector: messageInjector, class: classMessage})
      }
    console.log('messages ', this.messages)
  }

  changeChat(){
    if (this.showChat == false){
      this.auth.checkUser().then((user: User) => {
        this.role = user.role
        if (this.role == Role.provisor){
          this.author = this.username = 'admin'
        }
        else {
          this.author = 'user'
          this.getUserRequest().then((user: any) => {
            this.username = user.username
          })
        }
      })
    }
    this.showChat = !this.showChat
  }

  send(){
    const text = this.input.value
    this.webSocketService.sendMessage('message')
    if (this.author == 'user'){
      this.webSocketService.sendMessage({message: text, author: this.author, to: 'admin', from: this.username})
    } else if(this.author == 'admin'){
        this.dynamicComponentService.clearData()
        console.log(this.dynamicComponentService.data)
        this.dynamicComponentService.toggleMakeOrder()
        console.log(this.dynamicComponentService.getData())
        this.dynamicComponentService.data.forEach((message) => {
          const messageObject = {message: text, author: this.author, to: message.from, from: 'admin'}
          this.webSocketService.sendMessage(messageObject)
      })
    }
    this.input.value = null
  }

  getUserRequest(){
    return this.http.get('/user', {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }
}
