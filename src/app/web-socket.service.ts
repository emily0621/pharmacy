import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: Socket
  readonly url: string = 'ws://localhost:3000'

  constructor() {
    this.socket = io(this.url)
  }

  sendMessage(message: any){
    this.emit('send message', message)
  }


  listen(eventName: string){
    return new Observable<any>((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data)
      })
    })
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data)
  }
}
