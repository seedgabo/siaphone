import {PhotoLibrary} from '@ionic-native/photo-library';
import { Component } from '@angular/core';
import { Platform, ViewController, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { Transfer } from '@ionic-native/transfer';
declare var cordova;
@Component({
	selector: 'page-item-details',
	templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
	producto: any = {}
	pedidos = 1;
	loader = false;
	constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
		public api: Api, public alert: AlertController, public toast: ToastController, public transfer: Transfer,
		public viewctrl: ViewController,public photolibrary:PhotoLibrary) {
		this.producto = this.navParams.get("producto");
		var cantidad = this.navParams.get("cantidad");
		if(cantidad != undefined){
			this.pedidos = cantidad;
		}
	}

	agregarAlCarrito() {
		if (this.api.addToCart(this.producto, this.pedidos) == "agregado") {
			this.toast.create({ duration: 1000, message: "Producto agregado" }).present();
		} else {
			this.toast.create({ duration: 1000, message: "Producto actualizado" }).present();
		}
		this.dismiss();
	}

	dismiss() {
		this.viewctrl.dismiss();
	}

	editprecio() {
		this.alert.create({
			title: 'Editar Precio',
			inputs: [
				{
					name: 'precio',
					placeholder: 'Precio',
					value: "" + parseInt(this.producto.VAL_REF),
					type: "number"
				},
			],
			buttons: [
				{
					text: 'Cancelar',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Guardar',
					handler: data => {
						this.producto.VAL_REF = parseInt(data.precio);
					}
				}
			]
		}).present();
	}

	imagenLocal(producto: any) {
		if(this.platform.is("cordova") && !this.api.prefs.verImgOffline) {
			return cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + producto.COD_REF.trim() + ".jpg";
		}
		else {
			return producto.imagen
		}
	}

	saveImage() {
		this.loader = true;
		var transfer = this.transfer.create();
		transfer.onProgress((data) => {
			console.log(data);

		})
		transfer.download(this.producto.imagen,
			cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + this.producto.COD_REF.trim() + ".jpg",
			true,
		).then((entry) => {
			console.log(entry.toURL());
			this.photolibrary.saveImage(entry.toURL(),this.api.empresas[this.api.empresa].nombre,{quality:50})
			.then((item)=>{
				console.log(item);
				this.toast.create({duration:2500, message:"Imagen Guardada", position: "top"}).present();
				this.loader = false;
			})
			.catch((err)=>{
				console.error(err);
			});
		}).catch((err) => {
			this.loader = false;
			console.error(err);
		});
	}

}
