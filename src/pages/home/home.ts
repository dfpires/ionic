import { ChatProvider } from './../../providers/chat/chat';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';
import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { ChatPage } from '../chat/chat';
import { Chat } from './../../models/chat.model';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<User[]>;

  view: string ='chats';

  constructor(
        public authProvider: AuthProvider,
        public navCtrl: NavController,
        public userProvider: UserProvider,
        public chatProvider: ChatProvider) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad(){

    this.users = this.userProvider.users

  }
  onSignup(): void {
    this.navCtrl.push(SignupPage)
  }

  onChatCreate(recipientUser: User): void{
    // chama chat e passa o usuário escolhido para fazer char
    this.userProvider
      .mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {

        this.chatProvider
          .mapObjectKey<Chat>(this.chatProvider.getDeepChat(currentUser.$key, recipientUser.$key))
          .first()
          .subscribe((chat: Chat) => {   
              console.log('Chat ', chat );

              
            if (!chat.title) {              

              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new Chat('', timestamp, recipientUser.name, '');

              this.chatProvider.create(chat1, currentUser.$key, recipientUser.$key);

              let chat2 = new Chat('', timestamp, currentUser.name, '');

              this.chatProvider.create(chat2, recipientUser.$key, currentUser.$key);

            }
        });
      });

      this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    });
  }

  onLogout(): void {
    this.authProvider.logout();
  }
  
}
