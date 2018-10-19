import { Component, OnInit } from '@angular/core';

import { gridcobrancaDetalhaDTO } from '../dto/gridcobrancaDetalhaDTO';

import { ConsultaCobrancaService } from '../consulta-cobranca.service';
import { ConsultaCobrancaComponent } from '../consulta-cobranca.component';

declare var $: any;

@Component({
    selector: 'app-consulta-cobranca-detalhe',
    templateUrl: './consulta-cobranca-detalhada.component.html',
    styleUrls: ['./consulta-cobranca-detalhada.component.css']
})

export class ConsultaCobrancaDetalhadaComponent implements OnInit {

    gridDetalhe: gridcobrancaDetalhaDTO;

    mostraGridDetalhada = false;
    mostraGridDiferenca = false;

    dataConsulta = this.consolidada.dataConsulta;
    parceiro = this.consolidada.parceiria;
    evento: string = null;

    listaDiferencas: Array<any>;

    constructor(private servicesParceiro: ConsultaCobrancaService,
        private consolidada: ConsultaCobrancaComponent) { }

    ngOnInit() {
        this.getGridCobrancaDetalhada(this.parceiro);
    }

    public getGridCobrancaDetalhada(endpoint: string) {

        endpoint = this.parceiro;

        if (endpoint == null) {
            endpoint = '';
        } else {
            endpoint = `&idProduto=${endpoint}`;
        }

        this.servicesParceiro.buscaListaCobrancaDetalhada(this.consolidada.dataConsulta, endpoint).subscribe(
            res => {
                this.gridDetalhe = new gridcobrancaDetalhaDTO();
                this.gridDetalhe.grid = new Array();
                for (let i = 0; i < res.length; i++) {
                    this.gridDetalhe.grid.push(res[i]);
                }
                this.mostraGridDetalhada = true;
            }
        );
    }

    public defineEvento(evento) {
        if (evento === 'CHARGEBACK') {
            this.evento = 'CH';
            return this.evento;
        }
        if (evento === 'CANCELAMENTO') {
            this.evento = 'CA';
            return this.evento;
        }
        if (evento === 'VENDA') {
            this.evento = 'VD';
            return this.evento;
        }
    }

    public gerarPdf() {
        $('.export-visible').addClass('show');

        if (this.mostraGridDetalhada) {
            $('#cobranca-detalhada').tableExport({
                fileName: 'cobranca-detalhada',
                type: 'pdf',
                escape: 'false',
                bootstrap: true,
                jspdf: {
                    orientation: 'l',
                    margins: { right: 20, left: 20, top: 30, bottom: 30 },
                    autotable: {
                        styles: {
                            fillColor: 'inherit',
                            textColor: 'inherit',
                            fontStyle: 'inherit'
                        },
                        tableWidth: 'wrap'
                    }
                }
            });
        } else {
            $('#cobranca-detalhada-diferencas').tableExport({
                fileName: 'cobranca-detalhada-diferencas',
                type: 'pdf',
                escape: 'false',
                bootstrap: true,
                jspdf: {
                    orientation: 'l',
                    margins: { right: 20, left: 20, top: 30, bottom: 30 },
                    autotable: {
                        styles: {
                            fillColor: 'inherit',
                            textColor: 'inherit',
                            fontStyle: 'inherit'
                        },
                        tableWidth: 'wrap'
                    }
                }
            });
        }

        $('.export-visible').removeClass('show');
    }

    public gerarXls() {

        $('.export-visible').addClass('show');

        if (this.mostraGridDetalhada) {
            $('#cobranca-detalhada').tableExport({
                fileName: 'cobranca-detalhada',
                type: 'xlsx',
                jspdf: {
                    orientation: 'l',
                    margins: { right: 20, left: 20, top: 30, bottom: 30 },
                    autotable: {
                        styles: {
                            fillColor: 'inherit',
                            textColor: 'inherit',
                            fontStyle: 'inherit'
                        },
                        tableWidth: 'wrap'
                    }
                }
            });
        } else {
            $('#cobranca-detalhada-diferencas').tableExport({
                fileName: 'cobranca-detalhada-diferencas',
                type: 'xlsx',
                jspdf: {
                    orientation: 'l',
                    margins: { right: 20, left: 20, top: 30, bottom: 30 },
                    autotable: {
                        styles: {
                            fillColor: 'inherit',
                            textColor: 'inherit',
                            fontStyle: 'inherit'
                        },
                        tableWidth: 'wrap'
                    }
                }
            });
        }
        $('.export-visible').removeClass('show');
    }

    public exibirDiferencas(event) {
        if (event.target.checked) {
            this.carregarGridDiferenca();
            this.mostraGridDiferenca = true;
            this.mostraGridDetalhada = false;
        } else {
            this.mostraGridDiferenca = false;
            this.mostraGridDetalhada = true;
        }
    }

    public carregarGridDiferenca() {
        this.listaDiferencas = new Array();

        this.gridDetalhe.grid.forEach(item => {
            if (item.dtPrevistaLiquidacao !== item.dtLiquidacao) {
                this.listaDiferencas.push(item);
            }
        });
    }
}
