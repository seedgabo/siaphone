import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { CarritoPage } from "../carrito/carrito";

// @IonicPage()
@Component({
  selector: 'page-carritos',
  templateUrl: 'carritos.html',
})
export class Carritos {
  clientes = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Carritos');
    this.clientes =
      this.api.clientes.reduce(function (result, item) {
        var key = item.id  //first property: a, b, c
        result[key] = item;
        return result;
      }, {});
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

  proccess() {
    this.navCtrl.setRoot(CarritoPage);
  }

}
