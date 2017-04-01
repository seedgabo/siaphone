import { Page1 } from '../page1/page1';
import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, public alert: AlertController,
		public api: Api, public barcode: BarcodeScanner) { }

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}
	doLogin() {
		let loading = this.loading.create({ content: "Iniciando Sesión", duration: 10000 });
		loading.present();
		this.api.doLogin().then((data: any) => {
			if (!data.email) {
				let alert = this.alert.create({
					title: 'Error ' + data.status,
					subTitle: data._body,
					buttons: ['OK']
				});
				loading.dismiss();
				alert.present();
				return;
			}
			this.api.setData(this.api.data.username, this.api.data.password, this.api.data.url);
			this.api.user = data;
			this.api.saveUser(data);
			loading.dismiss();
			this.navCtrl.setRoot(Page1);
		}).catch((err) => {
			console.log(err);
			this.alert.create({ message: "Error al iniciar Session", buttons: ["OK"] }).present();
		});
	};
	scanCode() {
		this.barcode.scan().then((barcodeData) => {
			let data = JSON.parse(barcodeData.text);
			this.api.data.url = data.url + "/";
			this.api.data.username = data.username;
			this.api.data.password = "";
			this.api.token = data.token;
			this.api.storage.set("token", data.token);
			this.doLogin();
		}, (err) => {
			this.alert.create({ title: "Oops", subTitle: "Ocurrió un error " + err, buttons: ["Ok"] }).present();
		});
	}

}
