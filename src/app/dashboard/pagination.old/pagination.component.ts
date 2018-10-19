import { Component, OnInit, Input, OnChanges, AfterViewInit, DoCheck } from "@angular/core";
import { ChargebackComponent } from "../chargeback/chargeback.component";
import { PaginationService } from "./pagination.service";




@Component({
    selector: 'pagination',
    templateUrl : './pagination.component.html',
    styleUrls : ['./pagination.component.css']
})

export class PaginationComponent implements DoCheck{
     
    total: any;
    paginas: any[] = new Array();
    primeiraPagina: number;
    ultimaPagina: number;
    paginaAtual: any;

    constructor( private paginationService: PaginationService){}

    ngDoCheck(){
        this.setPrimeiraUltimaPagina();
        this.setQuantidadePaginas();
        //console.log(this.setQuantidadePaginas());
        this.getPrimeiraUltimaPagina();
        this.getQuantidadePaginas();
        //console.log(this.total);
        this.definePaginas();
        //console.log(JSON.stringify(this.paginas));
       // console.log(this.primeiraPagina +"    "+ this.ultimaPagina);
     }

    public setPrimeiraUltimaPagina(){
        this.primeiraPagina = this.paginationService.enviaInicio();
        this.ultimaPagina = this.paginationService.enviaFim();
    }

    public getPrimeiraUltimaPagina(){
        return (this.primeiraPagina, this.ultimaPagina);
    }

    public setQuantidadePaginas(){
         this.total = this.paginationService.enviaTamanho();
    }

    public getQuantidadePaginas(){
        return this.total;
    }

    public definePaginas(){
        this.paginas.length = Math.ceil(this.total/10);
        for(let i  = 0; i < this.paginas.length; i++){
            this.paginas[i] = i+1;
        }
        console.log(this.paginas)

        return this.paginas;
    }
   
    public acessarPagina(item, inicio, fim){
        this.paginaAtual = item;
        fim = this.ultimaPagina;
        inicio = this.primeiraPagina;
        fim = item * 10;
        inicio = fim - 9;
        console.log(inicio, fim);
        let paginar: boolean = true;
        console.log(paginar);
        this.paginationService.recebePaginas(inicio, fim, paginar);
    }
}