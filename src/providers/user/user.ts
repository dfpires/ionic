import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { BaseService } from '../base.service';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class UserProvider  extends BaseService{

  users: Observable<User[]>;

  constructor(
       public db: AngularFireDatabase
    ) {
        super()
        this.list()
  }

  list(): void {
    this.users = this.mapListKeys<User>(
      this.db.list<User>(`/users`,
        (ref: firebase.database.Reference) => ref.orderByChild('name')
      )
    )
  }
  create(user: User, uuid: string): Promise<void>{
    return this.db.object(`/users/${uuid}`)
      .set(user)
  }

}
