import { Component, OnInit, EventEmitter } from '@angular/core';
import { TabHeadingDirective } from 'ngx-bootstrap';
import { equal } from 'assert';

@Component({
  selector: 'app-tratamento-queda',
  templateUrl: './tratamento-queda.component.html',
  styleUrls: ['./tratamento-queda.component.css']
})
export class TratamentoQuedaComponent implements OnInit {

  public filtroSelecionado: any;
  
  public maskProposta = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  public maskSerie = [/[A-Z]/, /[A-Z]/];
  public maskTitulo = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  //public maskData = [/[0-2]/, /[0]/, '/', , '/', /[2]/, /[0]/, /[0-9]/, /[0-9]/];
  //public dataMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  //public maskParcela = [/[0-9]/, /[0-9]/];
  
  constructor() { }

  ngOnInit() {
    this.filtroSelecionado = '*';
  }

  public exibirCampo(item){

    if  (this.filtroSelecionado == item) {
       return true;
    }else{
      return false;
    }
    
  }
  public selecionaFiltro(event) {

    this.filtroSelecionado = event.target.value;
    return this.filtroSelecionado;

  }
}
