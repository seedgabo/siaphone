
import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import  {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
// import * as  _ from 'lodash';
@Injectable()
export class Api {
    data:any={};
	user:any={};
	empresa:any;
	empresas:Array<any>;
	clientes:Array<any>=[];
	cliente:any = {};
	productos:Array<any>;
	token:any;
	cartera:Array<any>;
	offline:boolean= true;
    cartera_total:number=0;
    secure_code=false;
	carritos:Array<any>= [];
	carrito: any;
	prefs = { verTotal : true, verCarteraEmpresas: true };
    constructor(public http: Http, public storage:Storage) {
        this.initVar();
    }

    initVar(){
        // this.storage.get("offline").then( (data) => {if(data == "true")  this.offline = true; else this.offline == false; });
        this.storage.get("username").then( (data) => this.data.username = data );
        this.storage.get("token").then( (data) => this.token = data );
        this.storage.get("password").then( (data) => this.data.password = data );
        this.storage.get("url").then( (data)      => this.data.url = data );
        this.storage.get("cartera_total").then( (data)      => this.cartera_total = data );
        this.storage.get("user").then((data)      => {this.user = data ? JSON.parse(data): undefined;});
        this.storage.get("empresas").then((data)  => {this.empresas = data ? JSON.parse(data): undefined;});
        this.storage.get("empresa").then( (data)  => {this.empresa = data ? JSON.parse(data): undefined;});
        this.storage.get("clientes").then( (data) => {this.clientes = data ? JSON.parse(data): [];});
        this.storage.get("cliente").then( (data) =>  {this.cliente = data ? JSON.parse(data): undefined;});
        this.storage.get("productos").then( (data) =>  {this.productos = data ? JSON.parse(data): [];});
        this.storage.get("cartera").then( (data) =>  {this.cartera = data ? JSON.parse(data): [];});
        this.storage.get("carritos").then( (data) =>  {this.carritos = data ? JSON.parse(data): [];});
        this.storage.get("prefs").then( (data) =>  { if(data != undefined) { this.prefs = JSON.parse(data)} });
    }

    setData (username, password , url) {
        this.storage.set("username", username);
        this.storage.set("password", password);
        this.storage.set("url", url);
    };


    saveUser(user){
        this.storage.set("user",JSON.stringify(user));
    }

    doLogin(){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/auth", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, error => resolve(error));
        });
    }


    getEmpresas(){
        let headers= this.setHeaders();        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/getEmpresas", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.storage.set("empresas", JSON.stringify(data));
                resolve(data);
            });
        });
    }


    setEmpresaSelected(empresa){

        this.storage.set("empresa",empresa);
        this.empresa = empresa;
        this.cliente = null;
        console.log('Empresa '+ empresa + ' seleccionada');
    }


    getClientes(){
        let headers= this.setHeaders();        
		return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getClientes", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.storage.set("clientes",JSON.stringify(data));
                resolve(data);
            });
        });
    }


    setClienteSelected(cliente){
        this.storage.set("cliente",JSON.stringify(cliente));
        this.cliente = cliente;
        console.log('Cliente ' + cliente.NOM_TER + 'seleccionado' );
		if (this.getCarritos().length > 0){
			this.setCarrito(this.getCarritos()[0]);
		}else{
			this.createCarrito(this.cliente.id);
		}
    }

	clearCliente(){
		this.storage.remove("cliente");
        this.cliente = undefined;
		this.clearCarrito();
	}
	
	clearCarrito(){
		this.carrito = undefined;
	}

	setCarrito(carrito){
		this.carrito = carrito;
	}

    getProductos(p?: number){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getProductos?page="+(p!= undefined ? p :-1), {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                this.storage.set("productos", JSON.stringify(data.data));
                resolve(data);
            });
        });
    }

    searchProducto(query){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/searchProducto?query="+ query, {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    findProducto(id){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/producto/"+ id, {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    addToCart(producto,cantidad:number, sumar =false){
        producto.neto = producto.neto ? 1 : 0;
        producto.observacion = producto.observacion != undefined ? producto.observacion : '';
		var item = {
			COD_REF : producto.COD_REF,
			COD_CLI: this.cliente.COD_TER,
			NOM_REF: producto.NOM_REF,
			NOM_TER: producto.NOM_TER,
			empresa_id: this.empresa,
			VAL_REF:  parseInt(producto.VAL_REF),
			cantidad: cantidad,
			neto: producto.neto,
			observacion: producto.observacion
		}
		var index = this.carrito.items.findIndex((prod)=>{
			return item.COD_REF  == prod.COD_REF
		});

		if( index > -1 && index != undefined){
			if(sumar){
				let old = parseInt(this.carrito.items[index].cantidad);
				item.cantidad += old;
			}	
			this.carrito.items[index] = item;
			this.storage.set("carritos", JSON.stringify(this.carritos));
			return "actualizado";
		}
		this.carrito.items.push(item);
		this.storage.set("carritos", JSON.stringify(this.carritos));
		return "agregado";
    }

	removeFromCart(index){
		this.carrito.items.splice(index, 1);
		this.storage.set("carritos", JSON.stringify(this.carritos));
	}

    getCarrito(index){
		JSON.parse(this.carritos[index].data);
    }

    getCarritoAsync(carrito_index){
		return this.carritos[carrito_index];
    }

    getCarritos(){
		if(!this.cliente){
			return this.carritos;
		}
		return this.carritos.filter( carrito =>{
			return this.cliente.id == carrito.cliente_id;
		});
    }

	createCarrito(cliente_id){
		this.carritos.push({
			items: [],
			cliente_id: cliente_id
		});
		this.storage.set("carritos",JSON.stringify(this.carritos));
		this.carritos[this.carritos.length -1];
	}

    sendCarrito(carrito){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.post(this.data.url + "api/"+ this.empresa +"/procesarCarrito", carrito.items ,{headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                resolve(data);
            }, error => {
                return reject(error);
            });
        });
    }

	deleteCarrito(index:any = null){
		if(index == null){
			index = this.carritos.findIndex((carrito)=>{
				 return this.carrito == carrito;
			});
		}
		this.carrito = undefined;
		var deleteds = this.carritos.splice(index, 1);
		this.storage.set("carritos",JSON.stringify(this.carritos));
		return deleteds;
	}

    getCartera(){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getCartera", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                if( data.cartera)
                this.storage.set("cartera",JSON.stringify(data.cartera));
                resolve(data);
            });
        });
    }

    getCarteraPorCliente(codigo){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/"+ this.empresa +"/getCartera/" + codigo , {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                if(data.cliente)
                {
                    data.cliente.last_update = new Date();
                    resolve(data);
                }
            });
        });
    }

    setHeaders(){
        let headers = new Headers();
        if(this.token == undefined)
        headers.append("Authorization","Basic " + btoa(this.data.username + ":" + this.data.password));
        else
        headers.append("Auth-Token", this.token);

        headers.append("Content-Type","application/json");
        return headers;
    }

    getDataOffline(){
        let headers= this.setHeaders();
        return new Promise((resolve,reject) => {
            this.http.get(this.data.url + "api/getDataOffline", {headers : headers})
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                this.clientes = data.clientes;
                this.productos = data.productos;
                this.empresas = data.empresas;
                this.cartera = data.cartera;
                this.cartera_total = data.total;
                this.storage.set("clientes", JSON.stringify(data.clientes));
                this.storage.set("productos",  JSON.stringify(data.productos));
                this.storage.set("empresas",  JSON.stringify(data.empresas));
                this.storage.set("cartera",  JSON.stringify(data.cartera));
                this.storage.set("cartera_total",  JSON.stringify(data.total));
                resolve(data);
            });
        });
    }
}
