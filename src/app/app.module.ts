import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { IonicStorageModule } from '@ionic/storage';
import {MomentModule} from 'angular2-moment';

import {Api} from '../providers/api';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import * as moment  from 'moment';
import 'moment/min/locales';
moment.locale("es");

@NgModule({
  declarations: [
    MyApp,
	LoginPage,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot(),
	MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
	LoginPage,
    Page1,
    Page2
  ],
  providers: [
    StatusBar,SplashScreen,BarcodeScanner,
	Api,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
