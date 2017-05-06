import { Galeria } from './../pages/galeria/galeria';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { ItemDetailsPage } from '../pages/item-details/item-details'
import { CarritoPage } from '../pages/carrito/carrito'
import { Carritos } from '../pages/carritos/carritos'
import { PreferenciasPage } from '../pages/preferencias/preferencias';
import { CarteraPage } from '../pages/cartera/cartera';
import { CarteraPorClientePage } from '../pages/cartera-por-cliente/cartera-por-cliente';

import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';

import { Api } from '../providers/api';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Transfer } from '@ionic-native/transfer';
import { CodePush } from '@ionic-native/code-push';
import { PhotoLibrary } from '@ionic-native/photo-library';

import { CDVPhotoLibraryPipe } from './cdvphotolibrary.pipe.ts';

import Raven from 'raven-js';
import * as moment from 'moment';
import 'moment/min/locales';
moment.locale("es");
Raven
  .config('https://71ecc607247f4d8c83a76b7714f5faf2@sentry.io/165640')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
    console.error(err);
  }
}
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    Page1,
    Page2,
    ItemDetailsPage,
    CarritoPage,
    Carritos,
    PreferenciasPage,
    CarteraPage,
    CarteraPorClientePage,
    Galeria,
    CDVPhotoLibraryPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    Page1,
    Page2,
    ItemDetailsPage,
    CarritoPage,
    Carritos,
    PreferenciasPage,
    CarteraPage,
    CarteraPorClientePage,
    Galeria
  ],
  providers: [
    StatusBar, SplashScreen, BarcodeScanner, Transfer, CodePush, PhotoLibrary,
    Api,
    { provide: ErrorHandler, useClass: RavenErrorHandler }
  ]
})
export class AppModule { }
