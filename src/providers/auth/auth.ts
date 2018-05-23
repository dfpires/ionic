import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from "angularfire2/auth";
import { BaseService } from '../base.service';
import * as firebase from 'firebase/app';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider extends BaseService{

  constructor(public afAuth: AngularFireAuth,
              public http: Http,
              
  ) {
    super();
    console.log('Hello AuthProvider Provider');
  }

  // cria uma autenticação com email e senha
  // retorna o UID da autenticação
  createAuthUser(user: {email: string, password: string}): Promise<firebase.User> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  // login ou sign - entrada no sistema
  // retorna true se entrou e false se não entrou
  signinWithEmail(user: {email: string, password: string}): Promise<boolean> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((authUser: firebase.User) => {
          return authUser != null;
      }).catch(this.handlePromiseError);
  }

// logout - encerra a conexão com o firebase
  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

// verifica se usuário está autenticado no Firebase
  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth
        .authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
  }

}
