import { 
	Component, 
	Input, 
	OnInit, 
	Output, 
	EventEmitter 
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-table-paginations',
  templateUrl: './table-paginations.component.html',  
  styleUrls: ['./table-paginations.component.min.css']  
})
export class TablePaginationsComponent implements OnInit {

  public static readonly TOTAL_PAGS_PADRAO: number = 20;
	public static readonly PAG_PADRAO: number = 1;
	public static readonly REG_PADRAO: number = 0;
	public static readonly ADJACENTES_PADRAO: number = 10;
 
  	@Input() qtdPorPagina: number;
  	@Input() itens : Array<any> = new Array();
	@Input() totalItens: number;
	@Input() qtdAdjacentes: number;
	@Output() onPaginate: EventEmitter<number> = new EventEmitter<number>();
 

	pagina: number;
	paginas: Array<number> = new Array();
	exibirProximo: boolean;
	qtdPaginas: number;
 
	constructor(private route: ActivatedRoute) {
	}
 
	ngOnInit() {
		this.qtdAdjacentes = this.qtdAdjacentes || TablePaginationsComponent.ADJACENTES_PADRAO;
		this.qtdPorPagina = this.qtdPorPagina || TablePaginationsComponent.TOTAL_PAGS_PADRAO;
		this.pagina = +this.route.snapshot.queryParams['pagina'] || TablePaginationsComponent.PAG_PADRAO;
		this.totalItens= this.totalItens || TablePaginationsComponent.REG_PADRAO;
		this.qtdPaginas = Math.ceil(this.totalItens / this.qtdPorPagina);
		//console.log(this.qtdPaginas)
    	//console.log("quantidade de paginas"+this.qtdPaginas)
    	//console.log("tamanho"+this.totalItens)
		this.gerarLinks(); 
  }
  
  ngDoCheck() {

   // this.qtdAdjacentes = this.qtdAdjacentes || TablePaginationsComponent.ADJACENTES_PADRAO;
	//	this.qtdPorPagina = this.qtdPorPagina || TablePaginationsComponent.TOTAL_PAGS_PADRAO;
	//	this.pagina = +this.route.snapshot.queryParams['pagina'] || TablePaginationsComponent.PAG_PADRAO;
	//	this.totalItens= this.totalItens || TablePaginationsComponent.REG_PADRAO;
  //  this.qtdPaginas = Math.ceil(this.totalItens / this.qtdPorPagina);
		this.gerarLinks();
	} 
 
	/**
	 * Gera os links de paginação.
	 */
	gerarLinks() {
		this.qtdPaginas = Math.ceil(this.totalItens / this.qtdPorPagina);	
		if(this.qtdPaginas > 1) {
			this.exibirProximo = this.qtdPaginas !== this.pagina;
			this.paginas = new Array();
			/*for(var i = 1 ; i<this.qtdPaginas;i++){
				this.paginas.push(i)
			}*/
			let iniAdjacente = (this.pagina - this.qtdAdjacentes <= 0) ? 1 : 
					(this.pagina - this.qtdAdjacentes);
			let fimAdjacente = (this.pagina + this.qtdAdjacentes >= this.qtdPaginas) ? 
					this.qtdPaginas : (this.pagina + this.qtdAdjacentes);
			//console.log('inicio: '+iniAdjacente+" - fim: "+fimAdjacente)
			for (let i=iniAdjacente; i<=fimAdjacente; i++) {
				this.paginas.push(i);
			}
		} else {
			this.paginas = new Array();
			this.exibirProximo = false
			
		}
		
	}
 
	/**
	 * Método responsável por chamar o Emitter de 
	 * paginação.
	 *
	 * @param number pagina
	 * @param any $event número da página a ser exibida.
	 */
	paginar(pagina: number, $event: any) {
		$event.preventDefault();
		this.pagina = pagina;
		this.gerarLinks();
		this.onPaginate.emit(pagina);
	}

}
