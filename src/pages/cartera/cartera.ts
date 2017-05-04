import { Api } from '../../providers/api';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CarteraPorClientePage } from '../cartera-por-cliente/cartera-por-cliente';
@Component({
    templateUrl: 'cartera.html'
})
export class CarteraPage {
    total: number;
    procesando: boolean = false;
    cartera: any;
    query = "";
    constructor(public nav: NavController, public api: Api) {
        this.getCartera();
    }

    getCartera() {
        if (this.api.offline) {
            this.cartera = this.api.cartera.filter((x) => {
                if (x.empresa_id == this.api.empresa) {
                    if (this.query == "") {
                        return true;
                    }
                    return x.NOM_TER.toLowerCase().indexOf(this.query.toLowerCase()) > -1 || x.COD_TER.toLowerCase().indexOf(this.query.toLowerCase()) > -1
                }
            })
            this.total = this.api.cartera_total;
        }
        else {
            this.procesando = true;
            this.api.getCartera().then((data: any) => {
                this.procesando = false;
                this.cartera = data.cartera;
                this.total = data.total;
            })
                .catch(
                (err) => {
                    console.error(err);
                });
        }
    }



    verCarteraCliente(cliente) {
        this.nav.push(CarteraPorClientePage, { cliente: cliente });
    }
}
