import { Injectable } from '@angular/core';
import { Message } from '../../models/message.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BaseService } from '../base.service';
import * as firebase from 'firebase/app';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider extends BaseService{

  constructor( public db: AngularFireDatabase ) {
        super();
    console.log('Hello MessageProvider Provider');
  }


  create(message: Message, listMessages: AngularFireList<Message>): Promise<void> {
    return Promise.resolve(listMessages.push(message));
  }

  getMessages(userId1: string, userId2: string): AngularFireList<Message> {    
    console.log(userId1, userId2);
    
    return this.db.list(`/messages/${userId1}-${userId2}`, 
      (ref: firebase.database.Reference) => ref.limitToLast(30).orderByChild('timestamp')
    );
  }
  
}
