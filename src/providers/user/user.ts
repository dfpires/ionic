import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FirebaseApp } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";

import { BaseService } from "../base.service";
import { User } from '../../models/user.model';

import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable()
export class UserProvider extends BaseService{

  users: Observable<User[]>;

  currentUser: AngularFireObject<User>;

  constructor(
       public db: AngularFireDatabase,
       public afAuth: AngularFireAuth,
       public firebaseApp: FirebaseApp
    ) {
        super()
        this.listenAuthState()
  }

  // recupera a lista de usuários e retira usuário logado

  private setUsers(uidToExclude: string): void {
    this.users = this.mapListKeys<User>(
      this.db.list<User>(`/users`, 
        (ref: firebase.database.Reference) => ref.orderByChild('name')
      )
    )
    .map((users: User[]) => {      
      // retira o usuário logado da lista
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
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


  // executado quando usuário faz login
  private listenAuthState(): void {
    this.afAuth
      .authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          console.log('Auth state alterado!');          
          this.currentUser = this.db.object(`/users/${authUser.uid}`);
          this.setUsers(authUser.uid);
        }
      });
  }

  // recupera usuário pelo ID
  get(userId: string): AngularFireObject<User> {
    return this.db.object<User>(`/users/${userId}`);
  }


  edit(user: {name: string, username: string, photo: string}): Promise<void> {
    return this.currentUser
      .update(user)
      .catch(this.handlePromiseError);
  }

  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/users/${userId}`)
      .put(file);
  }

}
