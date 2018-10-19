import { ColumnTableIdPipe } from './column-table-id.pipe';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $jqueryNovo: any

@Component({
  selector: 'app-table-default',
  templateUrl: './table-default.component.html',
  styleUrls: ['./table-default.component.min.css']
})
export class TableDefaultComponent implements OnInit {


  lastOrderKey = ''
  lastOrderDirection = false //true signica ASC and false DESC

  @Input() tituloTabela: string = ""
  @Input() search: string = null;

  @Input() itensPerPage: number = 10
  atualPage = 0
  @Input() txtBotAcao1 : any
  @Input() txtBotAcao2 : any
  @Input() textoBuscar = "Buscar por ..."
  @Output() searchFor: EventEmitter<string> = new EventEmitter();
  /*numberOfPages : number
  currentPage : number = 1
  currentPageInitIndex = 1
  currentPageEndIndex = this.itensPerPage
  hasNext = false
  hasPrev = false*/

  listUsed: Array<any> = null

  inicio: boolean = true
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
  @Input() hasSearch: boolean = true;
  @Input() hasDeleteBtn: boolean = true;

  @Input() msgTituloSwal: string = '';
  @Input() msgCorpoSwal: string = '';

  /**
   * Itens que serão listados na tabela
   */
  @Input() tableList: Array<any> = null
  /**
   * Nome das colunas da tabela
   * caso o nome usado no display seja diferente do nome da capo, defina um nome atribuindo com o sinal de =
   * Ex:
   * id=#
   * nome do campo é id
   * nome a ser exibido na coluna #
   */
  @Input() tableKeys: Array<any> = null
  /**
   * Mostra o componente de ações caso habilitado
   */
  @Input() actionsEnable: boolean = true
  @Input() selfPagination: boolean = true
  @Input() numeroRegistros: number;

  @Output() editClicked: EventEmitter<any> = new EventEmitter()
  @Output() blockClicked: EventEmitter<any> = new EventEmitter()
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter()
  @Output() onPaginate: EventEmitter<any> = new EventEmitter()
  @Output() acao1Clicked: EventEmitter<any> = new EventEmitter()
  @Output() acao2Clicked: EventEmitter<any> = new EventEmitter()
  


  @Input() hasbtnAcao1 = false;
  @Input() hasbtnAcao2 = false;

  @Input() acao1Enabled = false;
  @Input() acao2Enabled = false;

  constructor() { }

  ngOnInit() {
    //this.preparePages()
    //this.paginar(1)
    this.inicio = true
    if (this.selfPagination)
      this.numeroRegistros = this.tableList.length;
      
  }
  ngDoCheck() {
    //if(this.inicio == true) {
    if (this.tableList) {
      this.listUsed = this.tableList.slice(this.atualPage, this.atualPage + this.itensPerPage)      
    }
    // console.log(this.tableList)
    //  this.inicio = false
    //}

  }


  /*ngAfterViewInit() {
    $jqueryNovo("#example").ready(function() {
      console.log("terminou")
      $jqueryNovo('#example').DataTable();
      
    } );
  }*/

  onSearch(search) {
    // console.log(search)
    this.searchFor.emit(search);
    this.paginar(0)
  }

  clickEdit(item) {
    this.editClicked.emit(item)
  }
  clickBlock(item) {
    //console.log("clickBlock")
    this.blockClicked.emit(item)
  }

  clickDelete(item) {
    this.deleteClicked.emit(item)
    //console.log("delete - "+item)
  }

  clickAcao1(item) {
    this.acao1Clicked.emit(item)    
  }

  clickAcao2(item) {
    this.acao2Clicked.emit(item)    
  }

  

  orderBy(field) {


    var p = new ColumnTableIdPipe()
    var key = p.transform(field, "=")


    if (this.lastOrderKey != key) {
      this.lastOrderDirection = !this.lastOrderDirection
    }
    var direction = this.lastOrderDirection

    this.tableList = this.tableList.sort(function (a, b) {

      var keyA = a[key],
        keyB = b[key];


      if (direction) {
        if (keyA > keyB) return 1
        if (keyA < keyB) return -1
      } else {
        if (keyA > keyB) return -1
        if (keyA < keyB) return 1
      }
      return 0;
    });

  }

  paginar(page) {
    if (this.selfPagination) {

      if (page > 0) {
        page = page - 1
      }

      page = page * this.itensPerPage
      this.atualPage = page
      /*var indexInit = this.tableList.length / page
      var indexFinal = indexInit + this.itensPerPage
      console.log(indexInit+" - "+indexFinal)
      this.listUsed = this.tableList.splice( indexInit , indexFinal ) */

      //console.log(page)
      this.listUsed = new Array()
      this.tableList.slice(page, page + this.itensPerPage).forEach(item => {
        this.listUsed.push(item)
      })
      //this.listUsed = this.tableList.slice(page,this.itensPerPage)
      // console.log(this.tableList)
    }
    else {

      this.onPaginate.emit(page);


    }
  }

}
