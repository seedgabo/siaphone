import { Component } from '@angular/core';

import {Platform, ActionSheetController,  AlertController,   NavController,    NavParams} from 'ionic-angular';
import { Api } from "../../providers/api";
import { ItemDetailsPage } from "../item-details/item-details";
declare var cordova:any;
@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
    actualPage:number=1;
    currentPage:number=0;
    lastPage:number=0;
    mostrarImagenes:boolean = false;
    procesando:boolean = false;
    query= "";
    productos:Array<any>;
  constructor(public platform:Platform,public nav: NavController, public navParams: NavParams, public api:Api, public alert:AlertController, public actionsheet:ActionSheetController) {
  }
    ionViewDidEnter(){
        window.setTimeout(()=>{
			var element:any = window.document.getElementsByClassName('searchbar-input')[0];
            element.focus();
            this.query = "";
        },500);
		this.getProductos();
    }

    getProductos(){
		if(this.api.offline){
			this.productos = this.api.productos.filter((prod)=>{
				if(prod.empresa_id == this.api.empresa)
				{
					if(this.query == ""){
						return true;
					}
					else{
						return prod.COD_REF.toLowerCase().indexOf(this.query) > -1 || prod.NOM_REF.toLowerCase().indexOf(this.query) > -1;
					}
				}
			});			
        }
    }

    goNext(){
        this.actualPage++;
        this.getProductos();
    }

    goPrevious(){
        this.actualPage--;
        this.getProductos();
    }

    verProducto(producto){
        this.nav.push(ItemDetailsPage , {producto: producto});
    }

    doInfinite(infiniteScroll){
        this.api.getProductos(this.actualPage).then((response:any) => {
            this.api.productos = response;
            this.actualPage++;
            if(this.api.productos.length){
                infiniteScroll.enable(false);
            }
            infiniteScroll.complete();
        });
    }

    buscarProducto(){
        if(this.api.secure_code){
            this.query = this.query.substring(1,this.query.length -1 )
        }
        if(!this.api.offline){
            this.procesando = true;
            this.api.searchProducto(this.query).then((response:any) =>{
                this.procesando = false;
                this.currentPage = response.current_page;
                this.lastPage = response.last_page;
                this.productos = response.data;
            });
        }
        else{
            let response = this.productos.filter((prod)=>{
                return prod.COD_REF.trim() ==  this.query;
            });
            if ( response.length == 1)
            {
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
                        this.mostrarImagenes= !this.mostrarImagenes;
                    }
                },{
                    text: 'Actualizar',
                    icon: "refresh",
                    handler: () => {
                        this.query = "",
                        this.actualPage =1;
                        this.getProductos();
                    }
                },{
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

    verPath(){
        this.alert.create({
            title: "Ver Archivos Localmente",
            message: "Guarde las imagenes en el directorio del telefono: " + cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/. \n  como jpg",
            buttons: ["Ok"]
        }).present();
    }

    imagenLocal(producto:any){
		if(this.platform.is("cordova"))
		{
        	return cordova.file.externalApplicationStorageDirectory + this.api.empresa + "/productos/" + producto.COD_REF.trim()  + ".jpg";
		}
		else{
			return producto.imagen
		}
    }
}
