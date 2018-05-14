
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import {AngularFireModule, FirebaseAppConfig} from 'angularfire2';
import { SignupPage } from '../pages/signup/signup';
import { UserProvider } from '../providers/user/user';
import { AngularFireDatabaseModule } from 'angularfire2/database';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyAmYLsF5UCyOt7yvBkSZTWCx4iNP9GqOsM",
  authDomain: "ionic3-chat-c87d8.firebaseapp.com",
  databaseURL: "https://ionic3-chat-c87d8.firebaseio.com",
  storageBucket: "ionic3-chat-c87d8.appspot.com",
  messagingSenderId: "264980668445"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseAppConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
