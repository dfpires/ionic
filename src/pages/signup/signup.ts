import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup

  constructor(
      public formBuilder: FormBuilder,
      public navCtrl: NavController,
      public navParams: NavParams,
      public userProvider: UserProvider) {

        let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        this.signupForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
  }



  onSubmit(): void {

    let uuid: string = Math.round((Math.random() * 100)).toString();
    this.userProvider.create(this.signupForm.value, uuid)
      .then(() => {
        console.log('Usuario cadastrado com sucesso ' + uuid);
      });
  }
}
