import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';
@Component({
  selector: 'page-preferencias',
  templateUrl: 'preferencias.html'
})
export class PreferenciasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {}

  ionViewDidLoad() {
  }

  savePrefs(){
	  this.api.storage.set("prefs", JSON.stringify(this.api.prefs));
  }

}
