import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { cobrancaDados } from './cobrancaDados';

import { AuxiliarService } from '../../portal-principal/service/auxiliar.service';

@Injectable()

export class ConsultaCobrancaService {
    url: any;
    constructor(
        private http: Http,
        private service: AuxiliarService
    ) { }

    puxaParceiros() {
        this.url = this.service.getParceiros();
        return this.http.get(this.url, { headers: this.getDefaultHeader() }).map(res => {
            console.log(res);
            return res.json();
        });
    }

    puxaListaCobranca(inicio, final, endpoint) {
        this.url = `${this.service.getListaCobrancas()}dataInicial=${inicio}&dataFinal=${final}${endpoint}`;
        return this.http.get(this.url, { headers: this.getDefaultHeader() }).map(res => {
            console.log(res);
            return res.json();
        }, error => {
            console.log(error);
            return error;
        });
    }

    buscaListaCobrancaDetalhada(data, endpoint) {
        this.url = `${this.service.getListaCobrancasDetalhada()}dataConsulta=${data}${endpoint}`;
        return this.http.get(this.url, { headers: this.getDefaultHeader() }).map(res => {
            return res.json();
        }, error => {
            return error;
        });
    }

    alterarCobrancaConsolidada(dados: cobrancaDados) {
        this.url = `${this.service.postTratarCobrancaConsolidada()}`;
        return this.http.post(this.url, JSON.stringify(dados), { headers: this.getDefaultHeader() }).map(res => {
            return res.json();
        }, error => {
            return error;
        });
    }

    private getDefaultHeader() {
        // tslint:disable-next-line:prefer-const
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }
}
