import { AuthProvider } from './../../providers/auth/auth';
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
  view: string ='chats';

  constructor(
        public authProvider: AuthProvider,
        public navCtrl: NavController,
        public userProvider: UserProvider) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
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

  onLogout(): void {
    this.authProvider.logout();
  }
  
}
