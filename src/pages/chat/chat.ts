import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from './../../models/user.model';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  messages: string[] = [];
  pageTitle: string;
  sender: User;
  recipient: User;

  constructor(
      public authProvider: AuthProvider,
      public navCtrl: NavController, 
      public navParams: NavParams,
      public userProvider: UserProvider) {
  }


  ionViewDidLoad() {
    // recupera o usuário que vai fazer chat
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;

    this.userProvider
      .mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
         this.sender = currentUser;
       
       } )
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  sendMessage(newMessage: string): void{
    this.messages.push(newMessage);
  }

}
