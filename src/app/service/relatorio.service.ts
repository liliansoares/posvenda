import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { AuxiliarService } from '../portal-principal/service/auxiliar.service';
import { exportaChargebackPdf } from '../dashboard/relatoriosPDF/chargebackPDF/exportaChargebackPDF';


@Injectable()
export class RelatorioExportService {
    constructor(
        private http: Http,
        private service: AuxiliarService
    ) { }

    exportaPdfChargeback(dados: exportaChargebackPdf) {
        let options = new RequestOptions({ headers: this.getDefaultHeader() });
        let url = `${this.service.postExportarPdfChargeback()}`;
        return this.http.post(url, JSON.stringify(dados), { headers: this.getDefaultHeader(), responseType: ResponseContentType.Blob }).map(res => {

            return new Blob([res.blob()], { type: 'application/pdf' })

        }, error => {
            return error;
        })
    }

    exportaExcelChargeback(dados: exportaChargebackPdf) {
        let options = new RequestOptions({ headers: this.getDefaultHeader()});
        let url = `${this.service.postExportarExcelChargeback()}`;
        return this.http.post(url, JSON.stringify(dados), {headers: this.getDefaultHeader(), responseType: ResponseContentType.Blob }).map( res => {
            return new Blob([ res.blob()], { type: 'application/vnd.ms-excel' })
        }, error => {
            return error;
        } )
    }

    private getDefaultHeader() {
        var headers = new Headers();
        headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }

}