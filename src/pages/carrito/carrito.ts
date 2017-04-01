import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html'
})
export class CarritoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarritoPage');
  }

}
