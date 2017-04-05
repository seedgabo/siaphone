import {Api} from '../../providers/api';
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
@Component({
    templateUrl: 'cartera-por-cliente.html',
})

export class CarteraPorClientePage {
    cliente:any={};
    desglose:Array<any>=[];
    constructor(public nav:NavController, public api:Api, params:NavParams) {
        this.cliente = params.get("cliente");
        this.getCarteraPorCliente();
        this.api.storage.get("cartera-" + this.cliente.COD_TER).then((data:any) =>{
             if(data){
				 if(this.api.prefs.verCarteraEmpresas)
                		this.desglose = JSON.parse(data);
				else
					this.desglose = JSON.parse(data).filter((item)=>{
						return item.empresa_id == this.api.empresa;
					});
			 }
        });
    }

    getCarteraPorCliente(){
        this.api.getCarteraPorCliente(this.cliente.COD_TER).then((data:any)=>{
            this.desglose = data.cliente;
            this.api.storage.set("cartera-" + this.cliente.COD_TER , JSON.stringify(data.cliente));
			if(this.api.prefs.verCarteraEmpresas)
					this.desglose = data.cliente;
			else
				this.desglose = data.cliente.filter((item)=>{
					return item.empresa_id == this.api.empresa;
				});
        });
    }

}
