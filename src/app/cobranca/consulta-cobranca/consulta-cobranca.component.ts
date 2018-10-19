import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { ConsultaCobrancaService } from './consulta-cobranca.service';

import { parceirosDTO } from './dto/parceirosDTO';
import { gridcobrancaDTO } from './dto/gridcobrancaDTO';
import { RelatorioCobrancaDetDTO } from './dto/relatorioCobrancaDetDTO';

import { FullLayoutComponent } from '../../portal-principal/view/full-layouts/full-layout.component';
import { cobrancaDados } from './cobrancaDados';

import swal from 'sweetalert2';


declare var $: any;

@Component({
  selector: 'app-consulta-cobranca',
  templateUrl: './consulta-cobranca.component.html',
  styleUrls: ['./consulta-cobranca.component.css']
})

export class ConsultaCobrancaComponent implements OnInit {

  imprimir = false;

  formulario: FormGroup;
  formCobranca: FormGroup;

  listaParceiros: parceirosDTO;
  listaCobrancas: gridcobrancaDTO;

  carregaParceiros = false;
  carregaGridCobranca = false;
  carregaAviso = false;
  ocultaCampos = false;
  mostrarDetalhes = false;
  mostrarHistorico = false;
  listarCobrancas = false;
  expandir = false;
  fecharLinha = false;
  alterarEdicao = false;
  gerandoExcel = false;

  mensagemDeSaida: string;
  mensagemDeErro: string;
  dataConsulta: string = null;
  parceiria: string = null;
  desbloqueiaLinha: any = null;
  usuario: string = this.fullLayout.nomeLogin;
  dataHistorico: string;
  usuarioHistorico: string;
  dataUltimaAlteracaoHistorico: string;

  public dataMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  constructor(private servicesParceiro: ConsultaCobrancaService, private formBuilder: FormBuilder,
    private fullLayout: FullLayoutComponent) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      dataInicial: [null, [Validators.required]],
      dataFinal: [null, [Validators.required]],
      parceiro: [null],
      status: [null]
    });

    this.formCobranca = this.formBuilder.group({
      descricao: [null],
      status: [null]
    });

    this.getParceiros();
  }

  public carregarCobranca(endpoint: string) {
    this.getListaCobrancas(endpoint);
  }

  public consultaDetalhada(dataPrimeira) {

    dataPrimeira = dataPrimeira.substr(0, 4) + dataPrimeira.substr(5, 2) + dataPrimeira.substr(8, 2);

    this.dataConsulta = dataPrimeira;
    this.parceiria = this.formulario.get('parceiro').value;
    this.mostrarDetalhes = true;

    return (this.dataConsulta, this.parceiria);
  }

  public getListaCobrancas(endpoint: string) {

    this.listarCobrancas = true;

    if (this.formulario.get('parceiro').value != null) {
      endpoint = '&idProduto=' + this.formulario.get('parceiro').value;
      if (this.formulario.get('status').value != null) {
        endpoint += '&status=' + this.formulario.get('status').value;
      }
    } else {
      endpoint = '';
      if (this.formulario.get('status').value != null) {
        endpoint += '&status=' + this.formulario.get('status').value;
      }
    }

    if (this.formulario.get('status').value === '0') {
      if (this.formulario.get('parceiro').value != null) {
        endpoint = '&idProduto=' + this.formulario.get('parceiro').value;
      } else {
        endpoint = '';
      }
    }

    if (this.formulario.get('parceiro').value === '0') {
      if (this.formulario.get('status').value != null) {
        endpoint = '&status=' + this.formulario.get('status').value;
      } else {
        endpoint = '';
      }
    }

    let inicio: string = this.formulario.get('dataInicial').value;
    let fim: string = this.formulario.get('dataFinal').value;

    inicio = inicio.substr(6, 4) + '' + inicio.substr(3, 2) + '' + inicio.substr(0, 2);

    fim = fim.substr(6, 4) + '' + fim.substr(3, 2) + '' + fim.substr(0, 2);

    this.servicesParceiro.puxaListaCobranca(inicio, fim, endpoint).subscribe(res => {

      if (res.length === 0) {
        this.mensagemDeErro = 'Nenhum resultado para os filtros informados.';
        this.carregaAviso = true;
        this.listarCobrancas = false;

        return this.carregaAviso;
      }

      if (res === null) {
        this.mensagemDeErro = 'Nenhum resultado para os filtros informados.';
        this.listarCobrancas = false;
        this.carregaAviso = true;
      } else {
        this.carregaAviso = false;
        this.carregaGridCobranca = true;
        this.listaCobrancas = new gridcobrancaDTO();
        this.listaCobrancas.grid = new Array();

        for (let i = 0; i < res.length; i++) {
          this.listaCobrancas.grid.push(res[i]);
        }

        this.listarCobrancas = false;
        this.carregaGridCobranca = true;
      }
    }, error => {
      this.mensagemDeErro = 'Nenhum resultado para os filtros informados.';
      this.listarCobrancas = false;
      this.carregaAviso = true;
      return this.carregaAviso;
    });
  }

  public getParceiros() {

    this.servicesParceiro.puxaParceiros().subscribe(res => {
      this.carregaParceiros = true;
      this.listaParceiros = new parceirosDTO();
      this.listaParceiros.lista = new Array();

      for (let i = 0; i < res.length; i++) {
        this.listaParceiros.lista.push(res[i]);
      }
    });
  }

  public verificaDataInicio(inicio) {

    if (inicio !== '') {

      this.formulario.patchValue({
        dataInicial: inicio,
        dataFinal: inicio
      });
    }
  }

  public mostraOpcoes() {
    $('.dropdown-toggle').dropdown();
  }

  public verificaDataFinal(fim) {
    if (fim !== '') {
      this.formulario.patchValue({
        dataFinal: fim
      });
    }
  }

  public limparDados() {
    this.formulario.reset();
    this.carregaGridCobranca = false;
    this.carregaAviso = false;
  }

  public tooltip() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  public gerarPdf() {

    this.ocultaCampos = true;
    $('.export-visible').addClass('show');
    $('#cobranca-consolidada').tableExport({
      cols: '2',
      position: 'top, bottom',
      fileName: 'cobranca-consolidada', type: 'pdf',
      bootstrap: false,
      jspdf: {

        orientation: 'l',
        margins: { right: 20, left: 20, top: 30, bottom: 30 },
        autotable: {
          styles: {
            fillColor: 'inherit',
            textColor: 'inherit',
            fontStyle: 'inherit',
            fontSize: '13',
            textAlign: 'right'
          },
          tableWidth: 'wrap'
        }
      }
    });
    $('.export-visible').removeClass('show');
    this.ocultaCampos = false;
  }

  public gerarXls() {
    this.gerandoExcel = true;

    let listaExcel: RelatorioCobrancaDetDTO[];
    listaExcel = new Array();

    this.listaCobrancas.grid.map(item => {
      return {
        data: item.dataResposta,
        venda: item.valVenda,
        cancelamento: item.valCancelamento,
        chargeback: item.valChargeback,
        totalRecebimento: item.valReceberTotal,
        totalLiquidado: item.valTotalLiquid,
        pendencia: item.valPendencia
      };
    }).forEach(item => listaExcel.push(item));

    let novoValVenda;
    let novoValCancelmaneto;
    let novoValChargeback;
    let novoValReceberTotal;
    let novoValTotalLiquid;
    let novoValPendencia;

    for (let i = 0; i < listaExcel.length; i++) {

      listaExcel[i].data = listaExcel[i].data.substr(8, 2) + '/' + listaExcel[i].data.substr(5, 2) + '/' + listaExcel[i].data.substr(0, 4);

      if (listaExcel[i].venda !== undefined) {
        // tslint:disable-next-line:no-construct
        novoValVenda = new String(listaExcel[i].venda);
        novoValVenda = novoValVenda.replace(',', '').replace('.', ',');

        if (novoValVenda.indexOf(',') === -1) {
          novoValVenda = novoValVenda + ',';
          listaExcel[i].venda = novoValVenda.substr(0, novoValVenda.indexOf(',') + 3);
        }
        novoValVenda = novoValVenda + '00';
        listaExcel[i].venda = novoValVenda.substr(0, novoValVenda.indexOf(',') + 3);
        parseInt(listaExcel[i].venda, 10);
        if (listaExcel[i].venda === '0') {
          listaExcel[i].venda = '0,00';

        }
      } else {
        // tslint:disable-next-line:no-construct
        novoValVenda = new String(0);
      }

      if (listaExcel[i].cancelamento !== undefined) {
        // tslint:disable-next-line:no-construct
        novoValCancelmaneto = new String(listaExcel[i].cancelamento);
        novoValCancelmaneto = novoValCancelmaneto.replace(',', '').replace('.', ',');

        if (novoValCancelmaneto.indexOf(',') === -1) {
          novoValCancelmaneto = novoValCancelmaneto + ',';
          listaExcel[i].cancelamento = novoValCancelmaneto.substr(0, novoValCancelmaneto.indexOf(',') + 3);
        }

        novoValCancelmaneto = novoValCancelmaneto + '00';
        listaExcel[i].cancelamento = novoValCancelmaneto.substr(0, novoValCancelmaneto.indexOf(',') + 3);

        if (listaExcel[i].cancelamento === '0') {
          listaExcel[i].cancelamento = '0,00';
        }
      } else {
        // tslint:disable-next-line:no-construct
        novoValCancelmaneto = new String(0);
      }

      if (listaExcel[i].chargeback !== undefined) {
        // tslint:disable-next-line:no-construct
        novoValChargeback = new String(listaExcel[i].chargeback);
        novoValChargeback = novoValChargeback.replace(',', '').replace('.', ',');

        if (novoValChargeback.indexOf(',') === -1) {
          novoValChargeback = novoValChargeback + ',';
          listaExcel[i].chargeback = novoValChargeback.substr(0, novoValChargeback.indexOf(',') + 3);
        }

        novoValChargeback = novoValChargeback + '00';
        listaExcel[i].chargeback = novoValChargeback.substr(0, novoValChargeback.indexOf(',') + 3);

        if (listaExcel[i].chargeback === '0') {
          listaExcel[i].chargeback = '0,00';
        }
      } else {
        // tslint:disable-next-line:no-construct
        novoValChargeback = new String(0);
      }

      if (listaExcel[i].totalRecebimento !== undefined) {
        // tslint:disable-next-line:no-construct
        novoValReceberTotal = new String(listaExcel[i].totalRecebimento);
        novoValReceberTotal = novoValReceberTotal.replace(',', '').replace('.', ',');

        if (novoValReceberTotal.indexO(',') === -1) {
          novoValReceberTotal = novoValReceberTotal + ',';
          listaExcel[i].totalRecebimento = novoValReceberTotal.substr(0, novoValReceberTotal.indexOf(',') + 3);
        }

        novoValReceberTotal = novoValReceberTotal + '00';
        listaExcel[i].totalRecebimento = novoValReceberTotal.substr(0, novoValReceberTotal.indexOf(',') + 3);

        if (listaExcel[i].totalRecebimento === '0') {
          listaExcel[i].totalRecebimento = '0,00';
        }
      } else {
        // tslint:disable-next-line:no-construct
        novoValReceberTotal = new String(0);
      }

      if (listaExcel[i].totalLiquidado !== undefined) {
        // tslint:disable-next-line:no-construct
        novoValTotalLiquid = new String(listaExcel[i].totalLiquidado);
        novoValTotalLiquid = novoValTotalLiquid.replace(',', '').replace('.', ',');
        if (novoValTotalLiquid.indexOf(',') === -1) {
          novoValTotalLiquid = novoValTotalLiquid + ',';
          listaExcel[i].totalLiquidado = novoValTotalLiquid.substr(0, novoValTotalLiquid.indexOf(',') + 3);
        }
        novoValTotalLiquid = novoValTotalLiquid + '00';
        listaExcel[i].totalLiquidado = novoValTotalLiquid.substr(0, novoValTotalLiquid.indexOf(',') + 3);
        if (listaExcel[i].totalLiquidado === '0') {
          listaExcel[i].totalLiquidado = '0,00';
        }
      } else {
        // tslint:disable-next-line:no-construct
        novoValTotalLiquid = new String(0);
      }

      if (listaExcel[i].pendencia !== undefined) {
        // tslint:disable-next-line:no-construct
        novoValPendencia = new String(listaExcel[i].pendencia);
        novoValPendencia = novoValPendencia.replace(',', '').replace('.', ',');

        if (novoValPendencia.indexOf(',') === -1) {
          novoValPendencia = novoValPendencia + ',';
          listaExcel[i].pendencia = novoValPendencia.substr(0, novoValPendencia.indexOf(',') + 3);
        }
        novoValPendencia = novoValPendencia + '00';
        listaExcel[i].pendencia = novoValPendencia.substr(0, novoValPendencia.indexOf(',') + 3);
        if (listaExcel[i].pendencia === '0') {
          listaExcel[i].pendencia = '0,00';
        }
      } else {
        // tslint:disable-next-line:no-construct
        novoValPendencia = new String(0);
      }
    }

    const cabecalhoCSV = [
      'DATA',
      'VENDA(R$)',
      'CANCELAMENTO(R$)',
      'CHARGEBACK(R$)',
      'TOTAL A RECEBER(R$)',
      'TOTAL  LIQUIDADO(R$)',
      'PEDÊNCIA(R$)'
    ];

    let titulo: any;

    titulo = ['Período: ' + listaExcel[0].data + ' à ' + listaExcel[listaExcel.length - 1].data];

    if (this.formulario.get('parceiro').value !== null) {

      titulo = [
        `Período: ${listaExcel[0].data} à ${listaExcel[listaExcel.length - 1].data}   
        Parceiro: ${this.formulario.get('parceiro').value}`
      ];

      if (this.formulario.get('status').value != null) {
        if (this.formulario.get('status').value === 'A') {
          titulo += [`   Situação: Em análise`];
        }
        if (this.formulario.get('status').value === 'C') {
          titulo += [`   Situação: Concluído`];
        } else {
          titulo += [`   Situação: Pendente`];
        }
      }
    } else {
      if (this.formulario.get('status').value != null) {
        if (this.formulario.get('status').value === 'A') {
          titulo = [`Período: ${listaExcel[0].data} à ${listaExcel[listaExcel.length - 1].data}`,
            `Situação: Em análise`];
        }
        if (this.formulario.get('status').value === 'C') {
          titulo = [`Período: ${listaExcel[0].data} à ${listaExcel[listaExcel.length - 1].data}`,
            `Situação: Concluído`];
        } else {
          titulo = [`Período: ${listaExcel[0].data} à ${listaExcel[listaExcel.length - 1].data}`,
            `Situação: Periodo`];
        }

      }
    }

    const configCSV = {
      fieldSeparator: ';'
      , quoteStrings: '"'
      , decimalseparator: '.'
      , showLabels: true
      , showTitle: true
      , title: titulo
      , headers: (cabecalhoCSV)
    };

    this.gerandoExcel = false;

    new Angular2Csv(listaExcel, 'Cobranca Consolidada', configCSV);
  }

  public expandirLinha(i, desc) {

    if (this.desbloqueiaLinha === i) {
      this.fecharLinha = false;
      this.desbloqueiaLinha = null;
      return (this.fecharLinha, this.desbloqueiaLinha);
    } else {
      this.desbloqueiaLinha = i;
      this.formCobranca.patchValue({
        descricao: desc
      });

      this.fecharLinha = true;
      return (this.fecharLinha, this.desbloqueiaLinha);
    }
  }

  public alterarCobranca(data, status, descricao, desc, endpoint: string) {

    this.alterarEdicao = true;
    this.usuario = this.fullLayout.nomeLogin;

    data = data.substr(0, 4) + data.substr(5, 2) + data.substr(8, 2);

    const usuarioLogado: string = this.usuario;

    const dados: cobrancaDados = new cobrancaDados(data, usuarioLogado, status, descricao);

    this.servicesParceiro.alterarCobrancaConsolidada(dados).subscribe(response => {
      swal({
        type: 'success',
        title: 'Cobrança atualizada com sucesso!',
        target: 'body'
      });

      this.getListaCobrancas(endpoint);
    }, error => {
      swal({
        type: 'error',
        title: 'Ocorreu algum erro na alteração.',
        target: 'body'
      });
    });

    this.alterarEdicao = false;
    this.desbloqueiaLinha = null;
    this.formCobranca.patchValue({
      status: null,
      descricao: desc
    });
  }

  public limparDadosEdicao(desc) {
    this.formCobranca.patchValue({
      status: null,
      descricao: desc
    });
  }

  public visualizarHistorico(data, user, dataUltimaAlteracaoHistorico) {

    if (user != null) {
      this.usuarioHistorico = user;
    } else {
      this.usuarioHistorico = 'Nenhum usuário realizou alteração.';
    }

    if (dataUltimaAlteracaoHistorico != null) {
      this.dataUltimaAlteracaoHistorico = `${dataUltimaAlteracaoHistorico.substr(8, 2)}/${dataUltimaAlteracaoHistorico.substr(5, 2)}/${dataUltimaAlteracaoHistorico.substr(0, 4)}`;
    } else {
      this.dataUltimaAlteracaoHistorico = 'Esta cobranca ainda não foi alterada.';
    }

    this.dataHistorico = `${data.substr(8, 2)}/${data.substr(5, 2)}/${data.substr(0, 4)}`;
    this.mostrarHistorico = true;
  }
}
