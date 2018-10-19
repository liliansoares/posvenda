import { LoginComponent } from './../portal-principal/view/login/login.component';
import { Usuario } from '../portal-principal/models/usuario';
import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as global from './../comuns/global';
import { environment } from './../../environments/environment';

@Injectable()
export class PropertiesService {
    //key: String = "gta"; //forçando esse nome aqui, simplesmente pq ainda não existe o propertires de posvenda

    //private endPoint: string = 'http://util/properties?key=' + this.key;
    /*private endPoint = environment.PropertyUrl;



    constructor(private _http: Http) {
        this.carregaArquivoProperties();
    }

    carregaArquivoProperties() {

        if (!global.recuperaPropertiesSession()) {
            this._http.get(this.endPoint).map(res => res.json()).subscribe(res => {
                sessionStorage.clear();
                sessionStorage.setItem(global.propertiesDTO, JSON.stringify(res));
            }, (err) => {
                console.log('Erro ao consultar o arquivo properties: ' + err);
            });
        }
    }*/
// tslint:disable-next-line:eofline
}