import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuxiliarService } from '../../../portal-principal/service/auxiliar.service';

@Injectable()

export class HistoricoCobrancaService {

    constructor(private _http: Http, private service: AuxiliarService) { }

    buscarHistorico(data: string, posIni, posFim) {
        const url = `${this.service.getHistoricoCobrancas()}dataVencimento=${data}&posIni=${posIni}&posFim=${posFim}`;
        return this._http.get(url, { headers: this.getDefaultsHeaders() }).map(res => {
            return res.json();
        });
    }

    getDefaultsHeaders() {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }
}
