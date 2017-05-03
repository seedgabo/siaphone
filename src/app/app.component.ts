import { Galeria } from './../pages/galeria/galeria';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from "../pages/login/login";
import { CarritoPage } from "../pages/carrito/carrito";
import { PreferenciasPage } from "../pages/preferencias/preferencias";
import { Api } from "../providers/api";
import { CarteraPage } from "../pages/cartera/cartera";
import { CodePush } from "@ionic-native/code-push";
import { Carritos } from "../pages/carritos/carritos";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any;
	queryCliente = "";
	pages: Array<any>;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public api: Api) {
		this.initializeApp();
		this.api.storage.ready().then(() => {
			this.api.storage.get("user").then((user) => {
				if (user == undefined) {
					this.rootPage = LoginPage;
				} else {
					this.rootPage = Page1;
				}
			})
		});
		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: Page1, icon: "home", disabled: false },
			{ title: 'Productos', component: Page2, icon: 'pricetags', disabled: true },
			{ title: 'Carrito', component: CarritoPage, icon: 'cart', disabled: true },
			// { title: 'Galeria', component: Galeria, icon: 'photos', disabled: false, beta: true },
			{ title: 'Cartera', component: CarteraPage, icon: 'briefcase', disabled: false },
			{ title: 'Carritos', component: Carritos, icon: 'cart', disabled: false },
			{ title: 'Preferencias', component: PreferenciasPage, icon: 'cog', disabled: false },
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.codepush.sync().subscribe((syncStatus) => console.log(syncStatus), (err) => { console.warn(err) });
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
	clientesbyEmpresa() {
		return this.api.clientes.filter((cliente) => {
			if (cliente.empresa_id == this.api.empresa) {
				if (this.queryCliente == "") {
					return true;
				} else {
					return cliente.COD_TER.toLowerCase().indexOf(this.queryCliente.toLowerCase()) > -1 || cliente.NOM_TER.toLowerCase().indexOf(this.queryCliente.toLowerCase()) > -1
				}
			};
		});
	}
}
