import { Component } from '@angular/core';
import {ToastController, LoadingController,  AlertController,   NavController,    NavParams} from 'ionic-angular';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html'
})
export class CarritoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api, public alert:AlertController, 
  public loading:LoadingController, public toast:ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarritoPage');
  }

  procesarCarrito(){
	  var loader = this.loading.create({content:"procesando carrito"});
	  loader.present();
	  console.log(this.api.carrito);
	  this.api.sendCarrito(this.api.carrito).then(()=>{
		 loader.dismiss();
		 this.toast.create({duration:3000, message: "Carrito Procesado"}).present();
		 this.api.deleteCarrito();
	  }).catch((err)=>{
		  loader.dismiss().then(()=>{
			  this.alert.create({message:"No se puedo procesar el carrito", buttons:["Ok"]}).present();
		  })
			console.log(err);
	  })
  }

  clearCarrito(){
	  this.api.carrito.items = [];
	  this.api.storage.set("carritos", JSON.stringify(this.api.carritos));
  }
  total(){
	  var total = 0;
	  this.api.carrito.items.forEach((item)=>{
			total += item.cantidad * item.VAL_REF;
	  });
	  return total;
  }


}

