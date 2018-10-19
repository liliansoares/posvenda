import { Injectable } from '@angular/core';
import { ChargebackComponent } from '../chargeback/chargeback.component';

@Injectable()
export class PaginationService {

  totalPaginas: any;
  primeira: any;
  ultima: any;
  permissao: any;

  constructor() { }

  public buscaTamanho(total){
    this.totalPaginas = total;
    console.log(this.totalPaginas);
  }

  public enviaTamanho(){
    return this.totalPaginas;
  }

  public buscaInicioFim(inicio, fim){
    console.log(inicio);
    console.log(fim);
    this.primeira = inicio;
    this.ultima = fim;
  }

  public enviaInicio(){
    return this.primeira;
  }

  public enviaFim(){
    return this.ultima;
  }

  public recebePaginas(inicio, fim, permissao: boolean){
    this.primeira = inicio;
    this.ultima = fim;
    console.log(this.primeira, this.ultima);
    this.permissao = permissao;
    console.log(this.permissao);
  }

  public enviaPermissao(){
    let permissao = this.permissao;
    console.log("NO SERVIÇO DE PAGINAÇÃO : " + permissao);
    return permissao;
  }

} 
