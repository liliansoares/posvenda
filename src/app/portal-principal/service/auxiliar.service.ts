// import { getUrlZup } from './../comuns/global';
import { Http} from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import * as global from '../../comuns/global';
import * as moment from 'moment/moment';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuxiliarService {

    private userCache: any;

    constructor(private http: Http) {

    }


    getHistoricoCobrancas(){
        return environment.urlHistoricoCobrancas;
    }

    postExportarExcelChargeback(){
        return environment.urlExportaXLSChargeback;
    }

    postExportarPdfChargeback(){
        return environment.urlExportaPDFChargeback;
    }

    postTratarCobrancaConsolidada(){
        return environment.urlTratarCobranca;
    }

    getDownloadArqChargeback(){
        return environment.urlDownloadArqChargeback;
    }

    getListaCobrancasDetalhada(){
        return environment.urlListarCobrancasDetalhada;
    }

    getListaCobrancas(){
        return environment.urlListarCobrancas;
    }

    getParceiros(){
        return environment.urlGetParceiros;
    }

    postUpload(){
        return environment.urlPostUpload;
    }

    getStatus(){
        return environment.urlGetStatus;
    }

    getUrlGrid(){
        return environment.urlListarChargeBacks;
    }

    getUrlPlanos() {
        return environment.urlListarPlanos;
    }
      
    getUrlConsultarToken(){
        return environment.urlConsultarToken;
  
    }
    getUriLoginGTA() {
        return environment.uriLoginGTA;
    }

    getUriModulosGTA() {
        return environment.uriModulosGTA;
    }

    getUriFuncionalidadesGTA() {
        return environment.uriFuncionalidadesGTA;
    }

    getUriAcoesGTA() {
        return environment.uriAcoesGTA;
    }

    getAuth() {
        this.userCache = this.getCache();
        if (this.userCache) {
            return this.userCache;
        } else {
            return null;
        }

    }

    getCache() {//pegar token do cache, e enviar como cabeçalho nos serviços
        var usuario = global.recuperaUsuarioSession();
        if (usuario) {
            if (this.getCacheLogin(usuario.token)) {
                return usuario.token;
            } else {
                console.log('1 Token inválido');
                return null;
            }
        } else {
            console.log('2 Token inválido');
            return null;
        }
    }
    
    verificaCache(chave: any): Observable<any> {
       // this.retorno =  global.recuperaPropertiesSession();
       // var urlCache = this.retorno.urlCache;
       // var label = this.retorno.labelCacheLogin;
        var urlCache = global.urlCache;
        var label = global.labelCacheLogin;

        return this.http.get(urlCache + label + chave).map(res => res.json()).catch(this.handleError);
    }

    getCacheLogin(chave: any) {
        if( sessionStorage.getItem(global.userSession) ) {
            if(this.isTokenValid(JSON.parse( sessionStorage.getItem(global.userSession)) )) {
                console.log('aux : isTokenValid = true')
                return true;
            } else {    
                console.log('aux : isTokenValid = false')
                return false;
            }
        } else {
            console.log('aux : getItem = false')
            return false
        }

    }

    isTokenValid(resp: any) {
        if (resp) {
            return moment().isBefore(moment(resp.expires));
        } else {
            return false;
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('an error occured', error); //for demo purposes only
        return Promise.reject(error.message || error);
    }
}