export class exportaChargebackPdf{
    listaParametros = []
    qtdRegistros: string;
    nomeRelatorioJasper: string;

    constructor( paramlistaParametros: any[], paramqtdeRegistros: string, paramnomeRelatorioJasper: string  ){
        this.listaParametros = paramlistaParametros;
        this.qtdRegistros = paramqtdeRegistros;
        this.nomeRelatorioJasper = paramnomeRelatorioJasper;
    }
}