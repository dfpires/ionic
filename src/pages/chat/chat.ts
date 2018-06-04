import { ChatProvider } from './../../providers/chat/chat';
import { MessageProvider } from './../../providers/message/message';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { User } from './../../models/user.model';
import { Message } from '../../models/message.model';
import { AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Chat } from '../../models/chat.model';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  messages: AngularFireList<Message>;
  viewMessages: Observable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  private chat1: AngularFireObject<Chat>;
  private chat2: AngularFireObject<Chat>;

  constructor(
      public authProvider: AuthProvider,
      public chatProvider: ChatProvider,
      public messageProvider: MessageProvider,
      public navCtrl: NavController, 
      public navParams: NavParams,
      public userProvider: UserProvider) {
  }


  ionViewDidLoad() {
    // recupera o usuário que vai fazer chat
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;
    // recupera usuário logado
    this.userProvider
      .mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {
         this.sender = currentUser;

         this.chat1 = this.chatProvider.getDeepChat(this.sender.$key, this.recipient.$key);
         this.chat2 = this.chatProvider.getDeepChat(this.recipient.$key, this.sender.$key);

         let doSubscription = () => {
          this.viewMessages = this.messageProvider.mapListKeys<Message>(this.messages);
          this.viewMessages
            .subscribe((messages: Message[]) => {
              this.scrollToBottom();
            });
        };
         
         this.messages = this.messageProvider
         .getMessages(this.sender.$key, this.recipient.$key);


        this.messages
        .valueChanges()
        .first()
        .subscribe((messages: Message[]) => {

          if (messages.length === 0) {

            this.messages = this.messageProvider
              .getMessages(this.recipient.$key, this.sender.$key);

            doSubscription();

          } else {
            doSubscription();
          }

        });


       
       } )
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  sendMessage(newMessage: string): void{

    if (newMessage) {

      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

      this.messageProvider.create(
        new Message(
          this.sender.$key,
          newMessage,
          currentTimestamp
        ),
        this.messages
      ).then(() => {

        this.chat1
          .update({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });

        this.chat2
          .update({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          }); 
    });
  }
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content._scroll) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
  }

}