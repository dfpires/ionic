import { UserProvider } from './../../providers/user/user';
import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<User[]>;

  constructor(
        public navCtrl: NavController,
        public userProvider: UserProvider) {

  }

  ionViewDidLoad(){

    this.users = this.userProvider.users

  }
  onSignup(): void {
    this.navCtrl.push(SignupPage)
  }

  onChatCreate(user: User): void{
    console.log('User ', user);
  }
}
