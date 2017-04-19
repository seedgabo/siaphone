import { Component } from '@angular/core';

import { ToastController, LoadingController, NavController, AlertController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { LoginPage } from "../login/login";

@Component({
	selector: 'page-page1',
	templateUrl: 'page1.html'
})
export class Page1 {
	user: any;
	last_update_data: Date;
	clientes_collection = {};
	constructor(public navCtrl: NavController, public api: Api, public loading: LoadingController, public alert: AlertController, public toast: ToastController) {

		this.api.storage.get("last_update_data").then((date) => {
			if (date != undefined) {
				this.last_update_data = new Date(date);
			}
		});

		this.getEmpresas();
	}

	ionViewDidLoad() {
		setTimeout(() => {
			if (this.carritosByCliente().length > 0) {
				this.setCarrito(this.carritosByCliente()[0]);
			}
		}, 800);
	}

	getEmpresas() {
		this.api.getEmpresas()
			.then((data: any) => {
				console.log(data);
				this.api.empresas = data;
			})
			.catch((err) => {
				console.error(err);
			});
	};

	getClientes() {
		this.api.getClientes()
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	logout() {
		this.api.user = undefined;
		this.api.setData(undefined, undefined, undefined);
		this.navCtrl.setRoot(LoginPage);
	}

	setCarrito(carrito) {
		if (this.api.cliente == undefined || this.api.cliente.id != carrito.cliente_id) {
			var cliente = this.api.clientes.find(cli => {
				return cli.id == carrito.cliente_id;
			});
			this.api.setClienteSelected(cliente);
		}
		this.api.setCarrito(carrito);
		console.log("carrito", this.api.carrito);
	}

	cliente_collection(): any {
		var aux = {};
		this.api.clientes.forEach(cliente => {
			aux[cliente.id] = cliente;
		});
		return aux;
	}

	carritosByCliente() {
		if (!this.api.cliente) {
			return this.api.carritos;
		}
		return this.api.carritos.filter(carrito => {
			return this.api.cliente.id == carrito.cliente_id;
		});
	}

	getDataOffline(event) {
		//this.api.offline = !this.api.offline;
		this.api.storage.set("offline", this.api.offline);
		if (this.api.offline == true) {
			let loading = this.loading.create({ content: "Descargando datos offline" });
			loading.present();
			this.api.getDataOffline().then(data => {
				loading.dismiss().then(() => {
					this.api.storage.set("last_update_data", new Date());
					this.last_update_data = new Date();
					this.toast.create({ message: "Datos Descargados Correctamente", duration: 2000, closeButtonText: "listo" }).present();
				});
			}).catch((err) => {
				console.error(err);
				loading.dismiss().then(() => {
					this.alert.create({ buttons: ["OK"], message: "Error Obteniendo los datos" }).present();
				});
			});
		}
	}

}
