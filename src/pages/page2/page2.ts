import { Transfer } from '@ionic-native/transfer';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Component } from '@angular/core';
import $ from 'jquery';
import { Loading, LoadingController, Platform, ActionSheetController, AlertController, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { ItemDetailsPage } from "../item-details/item-details";
declare var cordova: any;
declare var window: any;
@Component({
    selector: 'page-page2',
    templateUrl: 'page2.html'
})
export class Page2 {
    index: number = 0;
    actualPage: number = 1;
    currentPage: number = 0;
    lastPage: number = 0;
    mostrarImagenes: boolean = false;
    procesando: boolean = false;
    query = "";
    productos: Array<any> = [{}];
    loader: Loading;
    constructor(public platform: Platform, public nav: NavController, public navParams: NavParams, public api: Api, public loading: LoadingController,
        public alert: AlertController, public actionsheet: ActionSheetController, public photolibrary: PhotoLibrary, public transfer: Transfer) {
        window.photolibrary = photolibrary;
    }


    ionViewDidEnter() {
        window.setTimeout(() => {
            var element: any = $("ion-searchbar > div > input").last();
            element.focus();
            console.log(element);
        }, 500);
        if (this.platform.is('android')) {
            this.photolibrary.requestAuthorization().then(() => {
                console.log(this.photolibrary.getAlbums());
            }).catch((err) => {
                console.error(err);
            });
        }
        this.getProductos();
    }

    getProductos(entrar = false) {
        if (this.api.offline) {
            this.productos = this.api.productos.filter((prod) => {
                if (prod.empresa_id == this.api.empresa) {
                    if (this.query == "") {
                        return true;
                    }
                    else {
                        return prod.COD_REF.toLowerCase().indexOf(this.query.toLowerCase()) > -1 || prod.NOM_REF.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                    }
                }
            });
            if (this.productos.length == 1 && entrar) {
                this.verProducto(this.productos[0]);
            }
        }
    }

    goNext() {
        this.actualPage++;
        this.getProductos();
    }

    goPrevious() {
        this.actualPage--;
        this.getProductos();
    }

    verProducto(producto) {
        this.nav.push(ItemDetailsPage, { producto: producto });
    }

    doInfinite(infiniteScroll) {
        this.api.getProductos(this.actualPage).then((response: any) => {
            this.api.productos = response;
            this.actualPage++;
            if (this.api.productos.length) {
                infiniteScroll.enable(false);
            }
            infiniteScroll.complete();
        });
    }

    buscarProducto() {
        if (this.api.secure_code) {
            this.query = this.query.substring(1, this.query.length - 1)
        }
        if (!this.api.offline) {
            this.procesando = true;
            this.api.searchProducto(this.query).then((response: any) => {
                this.procesando = false;
                this.currentPage = response.current_page;
                this.lastPage = response.last_page;
                this.productos = response.data;
            });
        }
        else {
            let response = this.productos.filter((prod) => {
                return prod.COD_REF.trim().toLowerCase().indexOf(this.query.toLowerCase()) > -1 || prod.NOM_REF.trim().toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            });
            if (response.length == 1) {
                this.verProducto(response[0]);
            }
        }
    }


    presentActionSheet() {
        let Sheet = this.actionsheet.create({
            title: 'Acciones',
            buttons: [
                {
                    text: 'Alternar Imagenes',
                    icon: "images",
                    handler: () => {
                        this.mostrarImagenes = !this.mostrarImagenes;
                    }
                }, {
                    text: 'Actualizar',
                    icon: "refresh",
                    handler: () => {
                        this.query = "",
                            this.actualPage = 1;
                        this.getProductos();
                    }
                }, {
                    text: 'Cancelar',
                    role: 'cancel',
                    icon: "close",
                    handler: () => {
                    }
                }
            ]
        });
        Sheet.present()
    }

    verPath() {
        this.alert.create({
            title: "Ver Archivos Localmente",
            message: "Guarde las imagenes en el directorio del telefono: " + cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/. \n  como jpg",
            buttons: ["Ok"]
        }).present();
    }

    imagenLocal(producto: any) {
        if (this.platform.is("cordova") && !this.api.prefs.verImgOffline) {
            return cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + producto.COD_REF.trim() + ".jpg";
        }
        else {
            return producto.imagen
        }
    }

    initSaveAlbum() {
        this.index = 0;
        this.loader = this.loading.create({
            content: "Descarando imagenes " + (this.index + 1) + " de " + this.productos.length,
        });
        this.loader.present();
        this.saveAllAlbum();
    }

    saveAllAlbum() {
        if (this.index < this.api.productos.length) {
            this.saveImage(this.api.productos[this.index++]);
            this.loader.setContent("Descarando imagenes " + (this.index + 1) + " de " + this.productos.length);
        }
        else {
            this.index++;
            console.log("ready");
            this.loader.dismiss();
            return "ready";
        }
    }

    saveImage(producto) {
        var transfer = this.transfer.create();
        transfer.onProgress((data) => {
            console.log(data);

        })
        transfer.download(producto.imagen,
            cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + producto.COD_REF.trim() + ".jpg",
            true,
        ).then((entry) => {
            console.log(entry.toURL());
            this.photolibrary.saveImage(entry.toURL(), this.api.empresas[this.api.empresa].nombre, { quality: 50 })
                .then((item) => {
                    console.log(item);
                    this.saveAllAlbum();
                })
                .catch((err) => {
                    console.error(err);
                    this.saveAllAlbum();

                });
        }).catch((err) => {
            console.error(err);
            this.saveAllAlbum();
        });
    }
}
