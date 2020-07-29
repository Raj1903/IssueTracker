import { Injectable } from '@angular/core';
import *as io from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://localhost:3000";
  private socket;

  constructor() {
    this.socket = io(this.baseUrl);
  }

  /**
   * Events to be listened
   */

  //event to listen for updates
  public listenForUpdates(userId) {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data)
      })
    })
  }

  //event to listen for auth-error
  public listenForAuthError(userId) {
    return Observable.create((observer) => {
      this.socket.on(`auth-error-${userId}`, (message) => {
        observer.next(message)
      })
    })
  }


  //notify updates about added-comment
  public notifyUpdates(data) {
    this.socket.emit('notify-updates', data);
  }

  //emitting verify user event
  public verifyUser(authToken, userId) {
    let data =
    {
      authToken: authToken,
      userId: userId
    }
    this.socket.emit('verify-user', data);
  }

  //disconnect socket
  public exitSocket = () => {
    this.socket.disconnect();
  }// end exit socket
}
