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

  showChat = false
  component:  Type<any>
  messagesInChat: Array<any> = new Array()
  messages: Array<any> = new Array()

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private injector: Injector,
    private webSocketService: WebSocketService,
    private dynamicComponentService: DynamicComponentService
  ) {
    this.webSocketService.listen('send message').subscribe((data: any) => {
      this.messagesInChat.push(data)
      console.log('received message: ', data)
    })
  }

  ngOnInit(): void {
    if (this.showChat == false){
      this.auth.checkUser().then((user: User) => {
        this.role = user.role
      })
    }
  }

  changeChat(){
    if (this.showChat == false){
      this.auth.checkUser().then((user: User) => {
        this.role = user.role
        if (this.role == Role.provisor){
          this.author = 'admin'
          this.prepareMessages('admin')
        }
        else {
          this.author = 'user'
          this.getUserRequest().then((user: any) => {
            this.prepareMessages(user.username)
          })
        }
      })
    }
    this.showChat = !this.showChat
  }

  prepareMessages(toUser: string){
    this.component = MessageComponent
    this.messages = new Array()
    console.log(this.messagesInChat)
    this.messagesInChat.forEach((message: any) => {
      if (message.to == toUser || message.from == toUser){
        let classMessage
        if ((message.author == 'admin' && this.role == Role.provisor) ||
          (message.author != 'admin' && this.role != Role.provisor)) classMessage = 'own_message'
          else classMessage = 'received_message'
          const messageInjector = Injector.create([{provide: Message, useValue: {message: message, classMessage: classMessage}}], this.injector)
          this.messages.push({injector: messageInjector, class: classMessage})
        }
      })
  }

  send(){
    this.auth.checkUser().then(() => {
      const text = this.input.value
      let messageObject
      if (this.author == 'user') {
        this.getUserRequest().then((user: any) => {
          messageObject = {message: text, author: this.author, to: 'admin', from: user.username}
          console.log(messageObject)
          this.messageToWebSocket(text, 'admin', user.username)
          this.sendMessage(messageObject)
        })
      }
      else {
        this.dynamicComponentService.clearData()
        console.log(this.dynamicComponentService.data)
        this.dynamicComponentService.toggleMakeOrder()
        console.log(this.dynamicComponentService.getData())
        this.dynamicComponentService.data.forEach((message) => {
          messageObject = {message: text, author: this.author, to: message.from, from: 'admin'}
          this.messageToWebSocket(text, message.from, 'admin')
        })
        this.sendMessage(messageObject)
        console.log(messageObject)
      }
    })
  }

  sendMessage(message: any){
    const messageInjector = Injector.create([{provide: Message, useValue: {message: message, classMessage: 'own_message'}}], this.injector)
    this.messages.push({injector: messageInjector, class: 'own_message'})
    this.input.value = null
  }

  messageToWebSocket(text: string, toUser: string, fromUser: string){
    const message = {message: text, author: this.author, to: toUser, from: fromUser}
    this.webSocketService.sendMessage(message)
  }

  getUserRequest(){
    return this.http.get('/user', {headers: this.auth.getHeaders(this.auth.getUser().access_token)}).toPromise()
  }
}
