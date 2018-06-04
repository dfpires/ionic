import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Chat } from '../../models/chat.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider extends BaseService{

  chats: AngularFireList<Chat>;

  constructor(
    public afAuth: AngularFireAuth,
      public db: AngularFireDatabase) {
    super();
    this.getChats();
    console.log('Hello ChatProvider Provider');
  }

  // recupera os chats de um usuário autenticado,
  // ordenado por timestamp
  private getChats(): void {
    console.log("consulta os chats do usuário logado");
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          console.log("está logado");
          this.chats = this.db.list<Chat>(`/chats/${authUser.uid}`, 
            (ref: firebase.database.Reference) => ref.orderByChild('timestamp')
          );
        }
      });
  }

  // cria um objeto de chat no firebase
  create(chat: Chat, userId1: string, userId2: string): Promise<void> {
    return this.db.object<Chat>(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }
  
  // retorna o chat criado entre userId1 e userId2
  getDeepChat(userId1: string, userId2: string): AngularFireObject<Chat> {
    return this.db.object<Chat>(`/chats/${userId1}/${userId2}`);
  }

}
