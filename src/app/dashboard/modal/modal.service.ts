import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prd';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuxiliarService } from '../../portal-principal/service/auxiliar.service';
import { Dados } from './dados';



@Injectable()
export class ModalService {


  url;
  url_de_upload;
  url_edicao;

  

  constructor(
    private http: Http,
    private auxiliar : AuxiliarService
  ) { }

  carregaStatus(){
    this.url = this.auxiliar.getStatus();
    return this.http.get(this.url, {headers: this.getDefaultHeader()}).map( res => {
      return res.json();
    })
  }

  alterarForm(dados: Dados){ 
    let options = new RequestOptions({headers: this.getUploadHeader()})
    this.url_edicao = this.auxiliar.postUpload();
    return this.http.post(this.url_edicao, JSON.stringify(dados), { headers: this.getUploadHeader()}).map( res => {
      return res.json();
    })
  }

  
  private getUploadHeader(){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    return headers;
  }

  
  private getDefaultHeader(){
    var headers = new Headers();
    headers.append('Content-type', 'application/json');
    headers.append('Accept', 'application/json');
    return headers;
  }

}
