import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {	
	producto:any = {}
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  this.producto = this.navParams.get("producto");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
  }

}
