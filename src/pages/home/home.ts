import { ChatProvider } from './../../providers/chat/chat';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
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

  chats: Observable<Chat[]>;

  view: string ='chats';

  constructor(
        public authProvider: AuthProvider,
        public navCtrl: NavController,
        public userProvider: UserProvider,
        public chatProvider: ChatProvider,
        public menuController: MenuController) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad(){

    // lista de chats do usuário
    this.chats = this.chatProvider.mapListKeys<Chat>(this.chatProvider.chats)
      .map((chats: Chat[]) => chats.reverse());

    // lista de usuário disponível, tirando eu
    this.users = this.userProvider.users;

    // habilita o menu depois que usuário estiver logado
    this.menuController.enable(true, 'user-menu');

  }
  // recebe como parâmetro quem está sendo chamdo
  // cria os chats
  onChatCreate(recipientUser: User): void{
    // chama chat e passa o usuário escolhido para fazer char
    this.userProvider
      // descobre quem está criando o chat
      .mapObjectKey<User>(this.userProvider.currentUser)
      .first()
      .subscribe((currentUser: User) => {

        this.chatProvider
          .mapObjectKey<Chat>(this.chatProvider.getDeepChat(currentUser.$key, recipientUser.$key))
          .first()
          .subscribe((chat: Chat) => {   
              console.log('Chat ', chat );

              
            if (!chat.title) {  // não existe chat entre usuario corrente e receptor            

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

  // abre os chats
  onChatOpen(chat: Chat): void {

    let recipientUserId: string = chat.$key;
    
    this.userProvider.mapObjectKey<User>(
      this.userProvider.get(recipientUserId)
    )
      .first()
      .subscribe((user: User) => {        

        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });

      });

  }

  onLogout(): void {
    this.authProvider.logout();
  }
  
}
