import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { BaseService } from '../base.service';
import { AngularFireAuth } from "angularfire2/auth";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class UserProvider extends BaseService{

  users: Observable<User[]>;

  currentUser: AngularFireObject<User>;

  constructor(
       public db: AngularFireDatabase,
       public afAuth: AngularFireAuth
    ) {
        super()
        this.list()
        this.listenAuthState()
  }

  // lista os usuário do Firebase
  list(): void {
    this.users = this.mapListKeys<User>(
      this.db.list<User>(`/users`,
        (ref: firebase.database.Reference) => ref.orderByChild('name')
      )
    )
  }
  // cria um usuário no RealTime DataBase com o UID da autenticação
  create(user: User, uuid: string): Promise<void>{
    return this.db.object(`/users/${uuid}`)
      .set(user)
      .catch(this.handlePromiseError);
  }

  // verifica se o username utilizado no cadastro já existe
  userExists(username: string): Observable<boolean> {
    return this.db.list(`/users`, 
      (ref: firebase.database.Reference) => ref.orderByChild('username').equalTo(username)
    )
    .valueChanges()
    .map((users: User[]) => {
      console.log(" Tamanho " + users.length)
      return users.length > 0;
    }).catch(this.handleObservableError);
  }


  private listenAuthState(): void {
    this.afAuth
      .authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          console.log('Auth state alterado!');          
          this.currentUser = this.db.object(`/users/${authUser.uid}`);
         // this.setUsers(authUser.uid);
        }
      });
  }

}
