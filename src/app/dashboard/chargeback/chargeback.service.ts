import { environment } from './../../../environments/environment';
import { AuxiliarService } from '../../portal-principal/service/auxiliar.service';
//import { PlanoProdutoAuxService } from '../../plano-produto/service/plano-produto-aux.service';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class ChargebackService{

    url;
    url1;
    constructor(
        private http: Http,
        private service: AuxiliarService,
       // private planoProdutoAuxService: PlanoProdutoAuxService
    ){}

    puxaPlanos() {
        this.url1 = this.service.getUrlPlanos();
        return this.http.get(this.url1, {headers: this.getDefaultHeader()}).map(res => {
            return res.json();
        });
    }

    carregaGrid(url){
        this.url = `${this.service.getUrlGrid()}${url}`;

        return this.http.get(this.url, {headers: this.getDefaultHeader()}).map( res => {
            return res.json();
        }, error => {
            console.log(error);
            return error;
        })
    }

    downloadArqChargeback(arquivo){
        this.url = `${this.service.getDownloadArqChargeback()}${arquivo}`;
        return this.http.get(this.url, { headers: this.getDefaultHeader()}).map(res => {
            return res.json();
        }, error => {
            console.log(error);
            return error;
        })
    }

    private getDefaultHeader(){
        var headers = new Headers();
        headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }
}