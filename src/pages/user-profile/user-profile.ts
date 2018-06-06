import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../models/user.model';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
 
  currentUser: User;
  canEdit: boolean = false;
  private filePhoto: File;
  uploadProgress: number;

  constructor(public userProvider: UserProvider, public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.userProvider.currentUser
      .valueChanges()
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.filePhoto) {

      let uploadTask = this.userProvider.uploadPhoto(this.filePhoto, this.currentUser.$key);

      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {

        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

      }, (error: Error) => {
        // catch error
      });

      uploadTask.then((UploadTaskSnapshot: firebase.storage.UploadTaskSnapshot) => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });

    } else {
      this.editUser();
    }

  }

  private editUser(photoUrl?: string): void {
    console.log("Usuário editado");
    this.userProvider
      .edit({
        name: this.currentUser.name,
        username: this.currentUser.username,
        photo: photoUrl || this.currentUser.photo || ''
      }).then(() => {
        this.canEdit = false;
        this.filePhoto = undefined;
        this.uploadProgress = 0;
      });
  }

  onPhoto(event): void {  
    this.filePhoto = event.target.files[0];
  }
  
}
