import { Component, OnInit } from "@angular/core";
import { ConsultaCobrancaComponent } from "../consulta-cobranca.component";
import { HistoricoCobrancaService } from "./historico-cobranca.service";
import { HistoricoCobrancaDTO } from "../dto/gridHistoricoCobrancaDTO";

@Component({
    selector: "app-historico-cobranca",
    templateUrl: "./historico-cobranca.component.html",
    styleUrls: ["./historico-cobranca.component.css"]
})
export class HistoricoCobrancaComponent implements OnInit{
    //VARIÁVEIS LOCAIS DO COMPONENTE EM ORDEM DE TIPO
    mensagemDeErro: string = '';
    data: string = this.consolidada.dataHistorico;
    usuario: string = this.consolidada.usuarioHistorico;
    mudanca: string = this.consolidada.dataUltimaAlteracaoHistorico;
    listaHistoricoCobranca: HistoricoCobrancaDTO = null;
    carregaPaginas: boolean = false;
    carregaHistorico: boolean = false;
    mostraHistorico: boolean = false;
    mostraErro: boolean = false;
    //VARIÁVEIS DA PAGINAÇÃO
    loading: boolean;
    total = 0;
    page = 1;
    limit = 10;
    constructor( private consolidada: ConsultaCobrancaComponent, //VARIÁVEL DE REFERÊNCIA AO COMPONENT DE COBRANÇA CONSOLIDADA
                 private historicoService: HistoricoCobrancaService /*VARIÁVEL DE REFERÊNCIA AO SERVICE QUE ALIMENTA ESTE COMPONENT*/){}
    ngOnInit(
    ){ 
        this.data = this.consolidada.dataHistorico;
        this.buscaHistorico(this.data); }
    //MÉTODO QUE CARREGA O HISTÓRICO ATUALIZADO.
    public buscaHistorico(data){
        let dt: string = data;
        var inicial;
        var final;
        inicial = (this.page - 1) * this.limit;
        final = inicial + this.limit;
        if (inicial > 0) {
            inicial++;
        }
        dt = dt.substr(6,4)+""+dt.substr(3,2)+""+dt.substr(0,2);
        console.log(dt);
        this.carregaHistorico = true;
        this.historicoService.buscarHistorico(dt, inicial, final).subscribe( res => {
            console.log(res);
            if(res.length == 0){
                this.carregaPaginas = false;
                this.mostraHistorico = false;
                this.mensagemDeErro = "Ainda não há registros nesse histórico.";
                this.mostraErro = true;
                console.log("HISTÓRICO VAZIO ", +  res);
            }
                this.carregaPaginas = true;
                this.listaHistoricoCobranca = new HistoricoCobrancaDTO();
                this.listaHistoricoCobranca.lista = new Array();
                for(let i = 0; i < res.length; i++){
                    this.listaHistoricoCobranca.lista.push(res[i]);
                }
                console.log(this.listaHistoricoCobranca);
                this.mostraHistorico = true;
            }, error => {
                this.mostraHistorico = false;
                this.carregaPaginas = false;
                this.mensagemDeErro = "Ocorreu um erro no carregamento do histórico, favor tente novamente ou contate o administrador do sistema.";
                console.log('ERRO NA CHAMADA DE HISTÓRICO ' + error);
                this.mostraErro = true;
        })
        this.carregaHistorico = false;
    }
    goToPage(n) {
        this.page = n;
        var data = this.data;
        this.buscaHistorico(data);
    }
    onNext(): void {
        this.page++;
        var data = data;
        this.buscaHistorico(data)
    }
    onPrev(): void {
        this.page--;
        var data = data;
        this.buscaHistorico(data);
    }
    onFirst(): void {
        this.page = 1;
        var data = data;
        this.buscaHistorico(data);
    }
    onLast(): void {
        this.page = Math.ceil(this.total / this.limit) || 0;;
        var data = data;
        this.buscaHistorico(data);
    }
}