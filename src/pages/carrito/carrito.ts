import { ItemDetailsPage } from '../item-details/item-details';
import { Component, NgZone } from '@angular/core';
import $ from 'jquery';
import { ModalController, ToastController, LoadingController, AlertController, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-carrito',
  templateUrl: 'carrito.html'
})
export class CarritoPage {
  precio_fijado: any = 0;
  query = "";
  agregando = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public zone: NgZone, public loading: LoadingController, public toast: ToastController, public modal: ModalController, public actionsheet: ActionSheetController) { }

  ionViewDidLoad() {
    window.setTimeout(() => {
      var element: any = $("ion-searchbar > div > input").last();
      element.focus();
      console.log(element);
      this.query = "";
    }, 500);
    this.api.storage.get("agregando-" + this.api.empresa).then((value) => {
      if (value != undefined) {
        this.agregando = parseInt(value);
      }
    })
  }

  procesarCarrito() {
    var loader = this.loading.create({ content: "procesando carrito" });
    loader.present();
    console.log(this.api.carrito);
    this.api.sendCarrito(this.api.carrito).then(() => {
      loader.dismiss();
      this.toast.create({ duration: 3000, message: "Carrito Procesado" }).present();
      this.zone.run(() => {
        this.api.deleteCarrito();
      })
    }).catch((err) => {
      loader.dismiss().then(() => {
        this.alert.create({
          title: "No se pudo procesar el carrito",
          message: JSON.stringify(err)
          , buttons: ["Ok"]
        }).present();
      })
      console.log(err);
    })
  }

  clearCarrito() {
    this.alert.create({
      title: "Esta seguro que desea limpiar el carrito",
      buttons: [
        {
          text: 'Si',
          handler: () => { this._clearCarrito() }
        },
        {
          text: 'No',
          handler: () => { }
        }
      ]
    }).present();
  }

  _clearCarrito() {
    if (!this.api.carrito) {
      return;
    }
    this.api.carrito.items = [];
    this.api.storage.set("carritos", JSON.stringify(this.api.carritos));
  }

  onInput(ev) {
    let q = this.query;

    if (q.length == 0) return;
    let producto;
    producto = this.api.productos.find((prod) => {
      return prod.empresa_id == this.api.empresa && prod.COD_REF.trim() == q.trim();
    });
    if (!producto) {
      producto = this.api.productos.find((prod) => {
        return prod.empresa_id == this.api.empresa && prod.COD_REF.trim() == q.substring(1, q.length - 1).trim();
      });
    }

    if (producto) {
      if (this.agregando == 0) {
        this.preguntarCantidad(producto);
      }
      else {
        this.toaster(this.api.addToCart(producto, this.agregando, true, this.precio_fijado));
        window.setTimeout(() => {
          var element: any = $("ion-searchbar > div > input").last();
          element.focus();
          console.log(element);
          this.query = "";
        }, 1000);
      }
    }
    else {
      this.toast.create({ message: "No se consiguió ninguno producto con este codigo", duration: 2000, position: "top" }).present().then(() => {
        window.setTimeout(() => {
          var element: any = $("ion-searchbar > div > input").last();
          element.focus();
          console.log(element);
          this.query = "";
        }, 500);
      });
    }
    this.query = "";
  }

  toaster(response) {
    if (response == "actualizado") {
      this.toast.create({ message: "Producto Actualizado", duration: 500 }).present();
      return
    }
    this.toast.create({ message: "Producto Agregado", duration: 500 }).present();
  }

  cambiarAgregando() {
    this.alert.create({
      title: "¿Cuantos desea agregar por codigo?", inputs: [{ type: "number", name: "agregando", value: this.agregando.toString() }], buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            this.agregando = parseInt(data.agregando);
            this.api.storage.set("agregando-" + this.api.empresa, data.agregando);
          }
        }
      ]
    }).present();
  }

  preguntarCantidad(producto) {
    var alert = this.alert.create({
      title: "Agregar al carrito",
      inputs: [
        {
          name: "cantidad",
          label: "Cantidad",
          placeholder: "12",
          type: "number",
          value: "" + this.agregando,
        }
      ],
      buttons: [
        {
          text: "Agregar",
          handler: (data) => {
            this.toaster(this.api.addToCart(producto, parseInt(data.cantidad), true, this.precio_fijado));
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(() => {
      window.setTimeout(() => {
        var element: any = $("ion-searchbar > div > input").last();
        element.focus();
        console.log(element);
        this.query = "";
      }, 500);
    })
  }

  total() {
    var total = 0;
    this.api.carrito.items.forEach((item) => {
      total += item.cantidad * item.VAL_REF;
    });
    return total;
  }

  totalCantidad() {
    var total = 0;
    this.api.carrito.items.forEach((item) => {
      total += parseInt(item.cantidad);
    });
    return total;
  }

  reverse() {
    return this.api.carrito.items = this.api.carrito.items.reverse();
  }

  eliminar(producto, index) {
    this.api.removeFromCart(index);
  }

  editar(producto) {
    let modal = this.modal.create(ItemDetailsPage, { producto: producto, cantidad: producto.cantidad, modal: true });
    modal.present();
  }

  cambiarPrecio(producto) {
    let prompt = this.alert.create({
      title: 'Cambiar Precio:',
      inputs: [
        {
          name: 'precio',
          placeholder: 'precio',
          type: 'number',
          value: producto.VAL_REF
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
            producto.VAL_REF = parseInt(data.precio);
            this.toaster(this.api.addToCart(producto, producto.cantidad));
          }
        }
      ]
    });
    prompt.present();
  }

  cambiarCantidad(producto) {
    let prompt = this.alert.create({
      title: 'Cambiar Cantidad:',
      inputs: [
        {
          name: 'cantidad',
          placeholder: 'cantidad',
          type: 'number',
          value: producto.cantidad
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
            this.toaster(this.api.addToCart(producto, data.cantidad));
          }
        }
      ]
    });
    prompt.present();
  }

  fijarPrecio() {
    var alert = this.alert.create({
      title: 'Precio',
      message: "Establecer en 0 para tomar el precio original",
      inputs: [{
        placeholder: "Precio Fijado",
        name: "precio",
        type: 'text',
        value: this.precio_fijado,
      }],
      buttons: [{
        text: "OK",
        handler: (data) => {
          this.precio_fijado = data.precio;
        }
      }, "Cancelar"]
    })
    alert.present()

  }

  actions() {
    var sheet = this.actionsheet.create({
      title: "Acciones"
    });

    sheet.addButton({
      text: "Invertir Carrito",
      handler: () => {
        this.reverse();
      }
    });

    sheet.addButton({
      text: "Fijar Precio",
      handler: () => {
        this.fijarPrecio();
      }
    });



    sheet.present();

  }


}

