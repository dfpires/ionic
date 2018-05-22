import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  messages: string[] = [];

  constructor(
      public authProvider: AuthProvider,
      public navCtrl: NavController, 
      public navParams: NavParams) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  sendMessage(newMessage: string): void{
    this.messages.push(newMessage);
  }

}
