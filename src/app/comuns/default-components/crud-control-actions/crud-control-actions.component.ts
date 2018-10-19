import { Mensagem } from './../../../model/mensagem';
import { element } from 'protractor';
import { ColumnTableNamePipe } from './../table-default/column-table-name.pipe';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import swal from 'sweetalert2'

@Component({
  selector: 'app-crud-control-actions',
  templateUrl: './crud-control-actions.component.html',
  styleUrls: ['./crud-control-actions.component.min.css']
})
export class CrudControlActionsComponent implements OnInit {

  /**
   * Elemento que está sendo tratado pelo crud control
   */
  @Input() element: any
  @Input() txtBotAcao1: any = "";
  @Input() txtBotAcao2: any = "";

  /**
   * Link para direcionar as aoções
   */
  @Input() resourceLink: string = ""

  /**
   * Identificador do objeto que está sendo controlado
   */
  @Input() identifierId: string = ""

  @Input() deleteEnabled = "false";
  @Input() acao1Enabled = "false";
  @Input() acao2Enabled = "false";

  /**
   * botão de edição visível
   */
  @Input() hasEditBtn: boolean = true;
  /**
   * botão de bloqueio visível
   */
  @Input() hasBlockBtn: boolean = true;
  /**
   * botão de deleção visível
   */
  @Input() hasDeleteBtn: boolean = true;
  @Input() hasbtnAcao1: boolean = true;
  @Input() hasbtnAcao2: boolean = true;


  @Input() msgTituloSwal = '';
  @Input() msgCorpoSwal = '';


  @Output() editClicked: EventEmitter<any> = new EventEmitter()
  @Output() blockClicked: EventEmitter<any> = new EventEmitter()
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter()
  @Output() clickbtnAcao1Clicked: EventEmitter<any> = new EventEmitter()
  @Output() clickbtnAcao2Clicked: EventEmitter<any> = new EventEmitter()

  constructor() {
  }

  ngOnInit() {
  }

  clickEdit() {
    console.log(`edit - ${this.identifierId}`)
    this.editClicked.emit(this.element)
  }
  clickBlock() {
    console.log(`block - ${this.identifierId}`)
    var context: CrudControlActionsComponent = this
    //var titulo = this.element.bloqueado? "Deseja Desbloquear?" : "Deseja Bloquear?"
    //var mensagem = this.element.bloqueado? "Desbloquear a plataforma" : "Bloquear a plataforma"
    var titulo = this.msgTituloSwal;
    var mensagem = this.msgCorpoSwal;

    swal({
      title: titulo,
      text: mensagem,
      type: 'warning',
      showCancelButton: true,
      //confirmButtonColor: '#a25421', // NÃO PODE FICAR AQUI! Após funcionar, preciso ver o que gera pra tratar no SASS! Zuma
      //cancelButtonColor: '#d3d3d3', // NÃO PODE FICAR AQUI! Após funcionar, preciso ver o que gera pra tratar no SASS! Zuma
      confirmButtonText: 'Sim',
    }).then(function () {
      context.element.bloqueado = !context.element.bloqueado
      context.blockClicked.emit(context.element)
    }, function () {
      //faz nada
      //cancelou a deleção
    })
  }

  clickDelete() {
    console.log(`remove - ${this.identifierId}`)

    var context: CrudControlActionsComponent = this
    swal({
      title: this.msgTituloSwal,
      text: this.msgCorpoSwal,
      type: 'warning',
      showCancelButton: true,
      //confirmButtonColor: '#a25421', // NÃO PODE FICAR AQUI! Após funcionar, preciso ver o que gera pra tratar no SASS! Zuma
      //cancelButtonColor: '#d3d3d3', // NÃO PODE FICAR AQUI! Após funcionar, preciso ver o que gera pra tratar no SASS! Zuma
      confirmButtonText: 'Sim',
    }).then(function () {
      context.deleteClicked.emit(context.element)
    }, function () {
      //faz nada
      //cancelou a deleção
    })

  }

  clickbtnAcao1() {
    var context: CrudControlActionsComponent = this
    context.clickbtnAcao1Clicked.emit(context.element)
  }

  clickbtnAcao2() {
    var context: CrudControlActionsComponent = this
    context.clickbtnAcao2Clicked.emit(context.element)
  }


}
