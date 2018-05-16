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

  createAuthUser(user: {email: string, password: string}): Promise<firebase.User> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }
}
