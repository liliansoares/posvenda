import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AuxiliarService } from '../portal-principal/service/auxiliar.service';

@Injectable()

export class ConsultaCobrancaService {
    url: any;

    constructor(private http: Http, private service: AuxiliarService) { }

    puxaParceiros() {
        this.url = this.service.getParceiros();

        return this.http.get(this.url, { headers: this.getDefaultHeader() }).map(res => {
            return res.json();
        });
    }

    private getDefaultHeader() {
        var headers = new Headers();
        headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }
}
