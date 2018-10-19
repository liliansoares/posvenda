import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { saveAs } from 'file-saver/FileSaver';

import { chargebackDTO } from './../dto/chargebackDTO';
import { PlanosDTO } from './../dto/planosDTO';
import { StatusDTO } from '../dto/statusDTO';
import { parceirosDTO } from '../../cobranca/consulta-cobranca/dto/parceirosDTO';

import { ChargebackService } from './chargeback.service';
import { AuxiliarService } from '../../portal-principal/service/auxiliar.service';
import { ModalService } from '../modal/modal.service';
import { ConsultaCobrancaService } from '../../cobranca/consulta-cobranca/consulta-cobranca.service';
import { RelatorioExportService } from '../../service/relatorio.service';

import { exportaChargebackPdf } from '../relatoriosPDF/chargebackPDF/exportaChargebackPDF';

declare var $: any;

@Component({
  selector: 'app-chargeback',
  templateUrl: './chargeback.component.html',
  styleUrls: ['./chargeback.component.css']
})
export class ChargebackComponent implements OnInit {

  @Output() onPaginate: EventEmitter<string> = new EventEmitter();

  painelDeImports: FormGroup;
  formulario: FormGroup;
  opcao: any = null;
  public maskMask;
  limite = new Date().getFullYear() + 3;

  public maskSerie = [/[A-Z]/, /[A-Z]/];
  public maskProposta = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  public maskData = [/[0-2]/, /[0]/, '/', , '/', /[2]/, /[0]/, /[0-9]/, /[0-9]/];
  public dataMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public maskParcela = [/[0-9]/, /[0-9]/];
  public maskTitulo = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  carregando: boolean = false;
  loadDados: boolean = false;
  mostrarBotao: boolean = true;
  carregandoStatus: boolean = false;
  carregaParceiros: boolean = false;
  carregarPagina: any = false;
  obrigatorio: any = null;
  filtroPessoa: any = null;
  paginaInicial: any = 1;
  paginaFinal: any = 10;
  totalPaginas: any;
  diferenca: any;
  public listando = false;
  public msg;

  /** Paginação */
  loading: boolean;
  total = 0;
  page = 1;
  limit = 10;
  ////////////////

  showEdicao: boolean = true;
  plan: any;
  parceiro: parceirosDTO
  situacao: StatusDTO;
  planos: PlanosDTO = null;
  grid: chargebackDTO = null;
  i: number = 0;
  data = new Date();

  tituloCharg: any;
  serieCharg: any;
  planoCharg: any;
  statusCharg: any;
  cpfCnpjCharg: any;
  nome: any;
  statusChargeback: any;
  nsuChargeback: any;
  numAutorizacaoChargeback: any;
  seqPedido: any;

  constructor(private formBuilder: FormBuilder, private service: ChargebackService, private modalService: ModalService,
    private servicesParceiro: ConsultaCobrancaService, private relatorio: RelatorioExportService) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({

      dataInicio: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      dataFinal: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      dataPrevisaoDebitoInicio: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      dataPrevisaoDebitoFinal: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      dataDebitoEfetivoInicio: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      dataDebitoEfetivoFinal: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      plano: [null],
      proposta: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(1)]],
      serie: [null, Validators.maxLength(2)],
      titulo: [null, Validators.maxLength(10)],
      parcela: [null, Validators.maxLength(2)],
      cpf: [null, Validators.maxLength(11)],
      cnpj: [null, Validators.maxLength(14)],
      situacao: [null],
      tipoPessoa: [null],
      parceiro: [null],
      opcao: [null]
    });

    this.painelDeImports = this.formBuilder.group({
      dataResposta: [null, Validators.pattern('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$')],
      status: [null]
    });

    this.getParceiros();
    this.callStatus();
    this.callPlanos();
  }

  paginar(page) {
    this.onPaginate.emit(page);
  }

  public mudaFiltros(event) {

    if (event.target.value != 8 || event.target.value != null || event.target.value != 'PF' || event.target.value != 'PJ') {
      if (this.formulario.get('cpf').value != null) {
        this.formulario.patchValue({
          cpf: null,
          tipoPessoa: null
        });
        this.opcao = null;
      }
      if (this.formulario.get('cnpj').value != null) {
        this.formulario.patchValue({
          cnpj: null,
          tipoPessoa: null
        })
        this.opcao = null;
      }
    }
    if (event.target.value == 'PF') {
      this.filtroPessoa = 'PF';
      return this.filtroPessoa;
    }
    if (event.target.value == 'PJ') {
      this.filtroPessoa = 'PJ'
      return this.filtroPessoa;
    }
    // data debito efetivo
    if (event.target.value == 10) {
      this.obrigatorio = 10;
      return this.obrigatorio;
    }
    // data prev. debito
    if (event.target.value == 9) {
      this.obrigatorio = 9;
      return this.obrigatorio;
    }
    // cpf/cnpj
    if (event.target.value == 8) {
      this.obrigatorio = 8;
      return this.obrigatorio;
    }
    // titulo
    if (event.target.value == 7) {
      this.obrigatorio = 7;
      return this.obrigatorio;
    }
    // proposta
    if (event.target.value == 5) {
      this.obrigatorio = 5;
      return this.obrigatorio;
    }
    // produto
    if (event.target.value == 6) {
      this.obrigatorio = 6;
      return this.obrigatorio;
    }
    // parceiro
    if (event.target.value == 4) {
      this.obrigatorio = 4;
      return this.obrigatorio;
    }
    // parcela
    if (event.target.value == 3) {
      this.obrigatorio = 3;
      return this.obrigatorio;
    }
    // situacao (status)
    if (event.target.value == 2) {
      this.obrigatorio = 2;
      return this.obrigatorio;
    }
    // data recep. chargeback
    if (event.target.value == 1) {
      this.obrigatorio = 1;
      return this.obrigatorio;
    }
    // selecione uma opcao
    if (event.target.value == 0) {
      this.obrigatorio = 0;
      return this.obrigatorio;
    }
    if (event.target.value == null) {
      this.obrigatorio = null;
      return this.obrigatorio;
    }
  }

  public getParceiros() {
    this.servicesParceiro.puxaParceiros().subscribe(res => {

      this.carregaParceiros = true;
      this.parceiro = new parceirosDTO();
      this.parceiro.lista = new Array();
      for (let i = 0; i < res.length; i++) {
        this.parceiro.lista.push(res[i]);
      }
    }, error => {
    });
  }

  public apagar() {
    this.formulario.reset();
    this.obrigatorio = null;
  }

  /**
   * Método responsável por realizar a consulta da lista de chargebacks.
   *
   * @param dataInicio
   * @param dataFim
   * @param dataPrevisaoDebitoInicio
   * @param dataPrevisaoDebitoFinal
   * @param dataDebitoEfetivoInicio
   * @param dataDebitoEfetivoFinal
   */
  consultarChargeback(dataInicio, dataFim, dataPrevisaoDebitoInicio, dataPrevisaoDebitoFinal,
    dataDebitoEfetivoInicio, dataDebitoEfetivoFinal) {

    this.msg = null;
    this.obrigatorio = null;

    var dataInicial: any = dataInicio;
    var dataFinal: any = dataFim;
    var dataPrevInicial: any = dataPrevisaoDebitoInicio;
    var dataPrevFinal: any = dataPrevisaoDebitoFinal;
    var dataDebInicial: any = dataDebitoEfetivoInicio;
    var dataDebFinal: any = dataDebitoEfetivoFinal;
    var cpfUsuario: any = this.formulario.get('cpf').value;
    var cnpjUsuario: any = this.formulario.get('cnpj').value;
    var dataF = dataFinal.substr(6, 4) + "" + dataFinal.substr(3, 2) + "" + dataFinal.substr(0, 2);
    var dataI = dataInicial.substr(6, 4) + "" + dataInicial.substr(3, 2) + "" + dataInicial.substr(0, 2);
    var dataPInicial = dataPrevInicial.substr(6, 4) + "" + dataPrevInicial.substr(3, 2) + "" + dataPrevInicial.substr(0, 2);
    var dataPFinal = dataPrevFinal.substr(6, 4) + "" + dataPrevFinal.substr(3, 2) + "" + dataPrevFinal.substr(0, 2);
    var dataDInicial = dataDebInicial.substr(6, 4) + "" + dataDebInicial.substr(3, 2) + "" + dataDebInicial.substr(0, 2);
    var dataDFinal = dataDebFinal.substr(6, 4) + "" + dataDebFinal.substr(3, 2) + "" + dataDebFinal.substr(0, 2);

    if (cpfUsuario != null) {
      var cpfU = cpfUsuario.substr(0, 3) + "" + cpfUsuario.substr(4, 3) + "" + cpfUsuario.substr(8, 3) + "" + cpfUsuario.substr(12, 2);
    }

    if (cnpjUsuario != null) {
      var cnpjU = cnpjUsuario.substr(0, 2) + "" + cnpjUsuario.substr(3, 3) + "" + cnpjUsuario.substr(7, 3) + "" + cnpjUsuario.substr(11, 4) + "" + cnpjUsuario.substr(16, 2);
    }

    this.formulario.patchValue({
      dataInicio: dataI,
      dataFinal: dataF,
      cpf: cpfU,
      cnpj: cnpjU,
      dataPrevisaoDebitoInicio: dataPInicial,
      dataPrevisaoDebitoFinal: dataPFinal,
      dataDebitoEfetivoInicio: dataDInicial,
      dataDebitoEfetivoFinal: dataDFinal
    });

    if ((this.formulario.get('dataInicio').value != null && this.formulario.get('dataInicio').value != '')
      && (this.formulario.get('dataFinal').value != null && this.formulario.get('dataFinal').value != '')) {

      let url: string = '?dataRecepcaoChargebackInicial=' + this.formulario.get('dataInicio').value
        + '&dataRecepcaoChargebackFinal=' + this.formulario.get('dataFinal').value;

      var inicial;
      var final;
      inicial = (this.page - 1) * this.limit;
      final = inicial + this.limit;
      if (inicial > 0) {
        inicial++;
      }

      url += '&posIni=' + inicial + '&posFim=' + final;

      // titulo
      if (this.formulario.get('titulo').value != null) {
        url += '&idTitulo=' + this.formulario.get('titulo').value;
      }

      // plano
      if (this.formulario.get('plano').value != null) {
        url += '&idPlano=' + this.formulario.get('plano').value;
      }

      // parceiro
      if (this.formulario.get('parceiro').value != null) {
        url += '&idProduto=' + this.formulario.get('parceiro').value;
      }

      //proposta
      if (this.formulario.get('proposta').value != null) {
        url += '&idProposta=' + this.formulario.get('proposta').value;
      }

      // serie
      if (this.formulario.get('serie').value != null) {
        url += '&idSerie=' + this.formulario.get('serie').value;
      }

      // parcela
      if (this.formulario.get('parcela').value != null) {
        url += '&parcela=' + this.formulario.get('parcela').value;
      }

      //situacao
      if (this.formulario.get('situacao').value != null) {
        url += '&idStatusChargeback=' + this.formulario.get('situacao').value;
      }

      // tipo pessoa e cpf
      if (this.formulario.get('tipoPessoa').value != null) {

        url += '&tipoPessoa=' + this.formulario.get('tipoPessoa').value;

        if (this.formulario.get('tipoPessoa').value === 'PF') {
          url += '&cpfCnpj=' + this.formulario.get('cpf').value;
        } else {
          url += '&cpfCnpj=' + this.formulario.get('cnpj').value;
        }
      }

      this.listando = true;

      this.service.carregaGrid(url).subscribe(res => {
        if (res == null) {
          this.msg = "Nenhum resultado para os filtros informados.";
        }

        if (res) {
          this.loadDados = true;

          this.grid = new chargebackDTO();
          this.grid.gridlist = new Array();
          for (let i = 0; i < res.length; i++) {
            this.grid.gridlist.push(res[i]);
            this.total = res[i].totalRegistros;
          }

          console.log('GRID LIST : ' + JSON.stringify(this.grid.gridlist));

          if (res.length === 0) {
            this.msg = "Nenhum resultado para os filtros informados.";
            this.total = 0;
          }

          this.listando = false;
        } else {
          this.msg = "Nenhum resultado para os filtros informados.";
          this.total = 0;
        }
      }, error => {
        this.msg = 'Nenhum resultado para os termos informados.';
        this.total = 0
        this.listando = false
      }, () => { this.listando = false })

    } else if ((this.formulario.get('dataPrevisaoDebitoInicio').value != null && this.formulario.get('dataPrevisaoDebitoInicio').value != '')
      && (this.formulario.get('dataPrevisaoDebitoFinal').value != null && this.formulario.get('dataPrevisaoDebitoFinal').value != '')) {

      let url: string = '?dataPrevisaoDebitoInicial=' + this.formulario.get('dataPrevisaoDebitoInicio').value
        + '&dataPrevisaoDebitoFinal=' + this.formulario.get('dataPrevisaoDebitoFinal').value;

      var inicial;
      var final;
      inicial = (this.page - 1) * this.limit;
      final = inicial + this.limit;
      if (inicial > 0) {
        inicial++;
      }

      url += '&posIni=' + inicial + '&posFim=' + final;

      // titulo
      if (this.formulario.get('titulo').value != null) {
        url += '&idTitulo=' + this.formulario.get('titulo').value;
      }

      // plano
      if (this.formulario.get('plano').value != null) {
        url += '&idPlano=' + this.formulario.get('plano').value;
      }

      // parceiro
      if (this.formulario.get('parceiro').value != null) {
        url += '&idProduto=' + this.formulario.get('parceiro').value;
      }

      //proposta
      if (this.formulario.get('proposta').value != null) {
        url += '&idProposta=' + this.formulario.get('proposta').value;
      }

      // serie
      if (this.formulario.get('serie').value != null) {
        url += '&idSerie=' + this.formulario.get('serie').value;
      }

      // parcela
      if (this.formulario.get('parcela').value != null) {
        url += '&parcela=' + this.formulario.get('parcela').value;
      }

      //situacao
      if (this.formulario.get('situacao').value != null) {
        url += '&idStatusChargeback=' + this.formulario.get('situacao').value;
      }

      // tipo pessoa e cpf
      if (this.formulario.get('tipoPessoa').value != null) {

        url += '&tipoPessoa=' + this.formulario.get('tipoPessoa').value;

        if (this.formulario.get('tipoPessoa').value === 'PF') {
          url += '&cpfCnpj=' + this.formulario.get('cpf').value;
        } else {
          url += '&cpfCnpj=' + this.formulario.get('cnpj').value;
        }
      }

      this.listando = true;

      this.service.carregaGrid(url).subscribe(res => {
        if (res == null) {
          this.msg = "Nenhum resultado para os filtros informados."
        }

        if (res) {
          this.loadDados = true;

          this.grid = new chargebackDTO();
          this.grid.gridlist = new Array();
          for (let i = 0; i < res.length; i++) {
            this.grid.gridlist.push(res[i]);
            this.total = res[i].totalRegistros;
          }
          // this.enviaTamanho(total);

          if (res.length === 0) {
            this.msg = "Nenhum resultado para os filtros informados.";
            this.total = 0;
          }

          this.listando = false;
        } else {
          this.msg = "Nenhum resultado para os filtros informados.";
          this.total = 0;
        }
      }, error => {
        this.msg = 'Nenhum resultado para os termos informados.';
        this.total = 0
        this.listando = false
      }, () => { this.listando = false })

    } else if ((this.formulario.get('dataDebitoEfetivoInicio').value != null && this.formulario.get('dataDebitoEfetivoInicio').value != '')
      && (this.formulario.get('dataDebitoEfetivoFinal').value != null && this.formulario.get('dataDebitoEfetivoFinal').value != '')) {

      let url: string = '?dataDebitoEfetivoInicial=' + this.formulario.get('dataDebitoEfetivoInicio').value
        + '&dataDebitoEfetivoFinal=' + this.formulario.get('dataDebitoEfetivoFinal').value;

      var inicial;
      var final;
      inicial = (this.page - 1) * this.limit;
      final = inicial + this.limit;
      if (inicial > 0) {
        inicial++;
      }

      url += '&posIni=' + inicial + '&posFim=' + final;

      // titulo
      if (this.formulario.get('titulo').value != null) {
        url += '&idTitulo=' + this.formulario.get('titulo').value;
      }

      // plano
      if (this.formulario.get('plano').value != null) {
        url += '&idPlano=' + this.formulario.get('plano').value;
      }

      // parceiro
      if (this.formulario.get('parceiro').value != null) {
        url += '&idProduto=' + this.formulario.get('parceiro').value;
      }

      //proposta
      if (this.formulario.get('proposta').value != null) {
        url += '&idProposta=' + this.formulario.get('proposta').value;
      }

      // serie
      if (this.formulario.get('serie').value != null) {
        url += '&idSerie=' + this.formulario.get('serie').value;
      }

      // parcela
      if (this.formulario.get('parcela').value != null) {
        url += '&parcela=' + this.formulario.get('parcela').value;
      }

      //situacao
      if (this.formulario.get('situacao').value != null) {
        url += '&idStatusChargeback=' + this.formulario.get('situacao').value;
      }

      // tipo pessoa e cpf
      if (this.formulario.get('tipoPessoa').value != null) {

        url += '&tipoPessoa=' + this.formulario.get('tipoPessoa').value;

        if (this.formulario.get('tipoPessoa').value === 'PF') {
          url += '&cpfCnpj=' + this.formulario.get('cpf').value;
        } else {
          url += '&cpfCnpj=' + this.formulario.get('cnpj').value;
        }
      }

      this.listando = true;

      this.service.carregaGrid(url).subscribe(res => {
        if (res == null) {
          this.msg = "Nenhum resultado para os filtros informados."
        }

        if (res) {
          this.loadDados = true;

          this.grid = new chargebackDTO();
          this.grid.gridlist = new Array();
          for (let i = 0; i < res.length; i++) {
            this.grid.gridlist.push(res[i]);
            this.total = res[i].totalRegistros;
          }

          if (res.length === 0) {
            this.msg = "Nenhum resultado para os filtros informados.";
            this.total = 0;
          }

          this.listando = false;
        } else {
          this.msg = "Nenhum resultado para os filtros informados.";
          this.total = 0;
        }
      }, error => {
        this.msg = 'Nenhum resultado para os termos informados.';
        this.total = 0
        this.listando = false
      }, () => { this.listando = false })

    } else {

      console.log('>>>> ENTROU NO ELSE ');

      let url: string = '?';

      var inicial;
      var final;

      inicial = (this.page - 1) * this.limit;
      final = inicial + this.limit;

      if (inicial > 0) {
        inicial++;
      }

      url += '&posIni=' + inicial + '&posFim=' + final;

      // tipo pessoa e cpf
      if (this.formulario.get('tipoPessoa').value != null) {

        url += '&tipoPessoa=' + this.formulario.get('tipoPessoa').value;

        if (this.formulario.get('tipoPessoa').value === 'PF') {
          url += '&cpfCnpj=' + this.formulario.get('cpf').value;
        } else {
          url += '&cpfCnpj=' + this.formulario.get('cnpj').value;
        }
      }

      // proposta
      if (this.formulario.get('proposta').value != null) {
        url += '&idProposta=' + this.formulario.get('proposta').value;
      }

      // parceiro
      if (this.formulario.get('parceiro').value != null) {
        url += '&idProduto=' + this.formulario.get('parceiro').value;
      }

      // plano
      if (this.formulario.get('plano').value != null) {
        url += '&idPlano=' + this.formulario.get('plano').value;
      }

      // serie
      if (this.formulario.get('serie').value != null) {
        url += '&idSerie=' + this.formulario.get('serie').value;
      }

      // titulo
      if (this.formulario.get('titulo').value != null) {
        url += '&idTitulo=' + this.formulario.get('titulo').value;
      }

      this.listando = true;

      this.service.carregaGrid(url).subscribe(res => {
        if (res == null) {
          this.msg = 'Nenhum resultado para os filtros informados.';
        }

        if (res) {
          this.loadDados = true;
          this.grid = new chargebackDTO();
          this.grid.gridlist = new Array();

          for (let i = 0; i < res.length; i++) {
            this.grid.gridlist.push(res[i]);
            this.total = res[i].totalRegistros;
          }

          if (res.length === 0) {
            this.msg = 'Nenhum resultado para os filtros informados.';
            this.total = 0;
          }

          this.listando = false;
        } else {
          this.msg = 'Nenhum resultado para os filtros informados.';
          this.total = 0;
        }
      }, error => {
        this.msg = 'Nenhum resultado para os termos informados.';
        this.total = 0;
        this.listando = false;
      }, () => { this.listando = false });
    }

    this.formulario.patchValue({
      dataInicio: dataInicio,
      dataFinal: dataFim,
      dataPrevisaoDebitoInicio: dataPrevisaoDebitoInicio,
      dataPrevisaoDebitoFinal: dataPrevisaoDebitoFinal,
      dataDebitoEfetivoInicio: dataDebitoEfetivoInicio,
      dataDebitoEfetivoFinal: dataDebitoEfetivoFinal
    });
  }

  evento(event) {

    this.opcao = event.target.value;

    if (this.opcao == 'PF') {
      if (this.formulario.get('cnpj').value != null) {
        this.formulario.patchValue({
          cnpj: null
        });
      }
      this.maskMask = [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
    }

    if (this.opcao == 'PJ') {
      if (this.formulario.get('cpf').value != null) {
        this.formulario.patchValue({
          cpf: null
        })
      }
      this.maskMask = [/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
    }

    return this.opcao
  }

  callPlanos() {

    this.service.puxaPlanos().subscribe(res => {
      this.carregando = true;
      this.planos = new PlanosDTO();
      this.planos.lista = new Array();

      for (let i = 0; i < res.length; i++) {
        this.planos.lista.push(res[i]);

      }
    }, error => {
    });
  }

  url = environment.urlDownloadArqChargeback;


  downloadArqChargeback(seqPedido: string) {
    let arquivo: string = `${seqPedido}.tiff`;
    let endpoint = this.url;
    endpoint = `${this.url}${arquivo}`;
    window.open(endpoint);
    endpoint = this.url;
  }

  showDownload(status: string, descricao: string) {
    if (status != 'Recusado') {
      if (descricao != null || descricao == null) {
        return descricao != null || descricao == null ? 'none' : 'inherit';
      }
    }
  }

  showCriticidade(status: string) {
    if (status == 'Acatado' || 'Recusado') {
      return status == 'Acatado' || status == 'Recusado' ? 'none' : 'inherit';
    }

    if (status == 'Expirado') {
      if (this.diff == 7) {
        return status == 'Expirado' && this.diff == 7 ? 'none' : 'inherit';
      }
    }
  }

  diferenca_tempo: any;
  diferenca_dias: any;

  showTratamento(dataResposta: string, dataRecepcao: string) {
    try {
      if (dataResposta == null || dataResposta == "") {
        return dataResposta == null || dataResposta == "" ? 'inherit' : 'contents';
      }

      if (dataResposta != null && dataResposta != "") {
        let dataFormatada = new Date(dataResposta);
        let dataOrigem = new Date(dataRecepcao);
        this.diferenca_tempo = Math.abs(dataOrigem.getTime() - dataFormatada.getTime());
        this.diferenca_dias = Math.abs(this.diferenca_tempo / (1000 * 3600 * 24));
        this.diferenca_dias = Math.round(this.diferenca_dias);
        return this.diferenca_dias == null ? 'inherit' : 'contents';
      }
    } catch (erro) {
      console.log();
    }
  }

  showDiferenca(status: string) {
    try {
      if (status == 'Recebido' || status == 'Expirado') {
        return status == 'Recebido' || status == 'Expirado' ? 'table-column' : 'contents';
      }
    } catch (error) {
      console.log();
    }
  }



  callStatus() {
    this.modalService.carregaStatus().subscribe(res => {
      this.carregandoStatus = true;
      this.situacao = new StatusDTO();
      this.situacao.lista = new Array();

      for (let i = 0; i < res.length; i++) {
        this.situacao.lista.push(res[i]);
      }
    }, error => {
    });
  }

  formataTable(tamanho) {
    if (tamanho) {
      return tamanho <= 9 ? '100%' : '350px';
    }
  }

  private verificaData(digData) {

    var bissexto = 0;
    var data = digData;
    var tam = data.length;

    if (tam == 10) {
      var dia = data.substr(0, 2)
      var mes = data.substr(3, 2)
      var ano = data.substr(6, 4)
      if ((ano > 1900) || (ano < 2100)) {
        switch (mes) {
          case '01':
          case '03':
          case '05':
          case '07':
          case '08':
          case '10':
          case '12':
            if (dia <= 31) {
              return true;
            } break
          case '04':
          case '06':
          case '09':
          case '11':
            if (dia <= 30) {
              return true;
            } break
          case '02':/* Validando ano Bissexto / fevereiro / dia */
            if ((ano % 4 == 0) || (ano % 100 == 0) || (ano % 400 == 0)) {
              bissexto = 1;
            }
            if ((bissexto == 1) && (dia <= 29)) {
              return true;
            }
            if ((bissexto != 1) && (dia <= 28)) {
              return true;
            } break
        }
      }
    }

    return false;
  }
  /**
   * MÉTODO PARA EXPORTAÇÃO PARA PDF, ESTE MÉTODO VERIFICA CADA CAMPO PREENCHIDO NO FORMULÁRIO
   * SE ELE É NULO OU NÃO INSERINDO NO CAMPO DE TRANSFERÊNCIA NECESSÁRIO DE PARÂMETROS QUE CHA-
   * MA O SERVIÇO POR MEIO DE UM POST PARA EXPORTAÇÃO PDF
   */
  gerarPdf(dataI, dataF) {
    let nomeRelatorioJasper: string = "relChargebacksPDF";
    let qtdeRegistros: string = this.total.toString();
    let listaParametros = [];
    dataI = this.formulario.get('dataInicio').value;
    dataI = dataI.substr(6, 4) + "" + dataI.substr(3, 2) + "" + dataI.substr(0, 2);
    dataF = this.formulario.get('dataFinal').value;
    dataF = dataF.substr(6, 4) + "" + dataF.substr(3, 2) + "" + dataF.substr(0, 2);
    
    if (dataI.length == 8) {
      let campoValor = {
        nome: "dataRecepcaoChargebackInicial",
        valor: dataI
      };
      listaParametros.push(campoValor);
    }
    if (dataF.length == 8) {
      let campoValor = {
        nome: "dataRecepcaoChargebackFinal",
        valor: dataF
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('plano').value != null) {
      let campoValor = {
        nome: "idPlano",
        valor: this.formulario.get('plano').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('proposta').value != null) {
      let campoValor = {
        nome: "idProposta",
        valor: this.formulario.get('proposta').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('serie').value != null) {
      let campoValor = {
        nome: "idSerie",
        valor: this.formulario.get('serie').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('titulo').value != null) {
      let campoValor = {
        nome: "idTitulo",
        valor: this.formulario.get('titulo').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('parcela').value != null) {
      let campoValor = {
        nome: "parcela",
        valor: this.formulario.get('parcela').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('cpf').value != null) {
      let campoValor = {
        nome: "cpfCnpj",
        valor: this.formulario.get('cpf').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('cnpj').value != null) {
      let campoValor = {
        nome: "cpfCnpj",
        valor: this.formulario.get('cnpj').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('situacao').value != null) {
      let campoValor = {
        nome: "idStatusChargeback",
        valor: this.formulario.get('situacao').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('tipoPessoa').value != null) {
      let campoValor = {
        nome: "tipoPessoa",
        valor: this.formulario.get('tipoPessoa').value.toString()
      };
      listaParametros.push(campoValor)
    }
    if (this.formulario.get('parceiro').value != null) {
      let campoValor = {
        nome: "idProduto",
        valor: this.formulario.get('parceiro').value.toString()
      };
      listaParametros.push(campoValor);
    }

    let dados: exportaChargebackPdf = new exportaChargebackPdf(listaParametros, qtdeRegistros, nomeRelatorioJasper);

    this.relatorio.exportaPdfChargeback(dados).subscribe(response => {

      saveAs(response, "REL_CHARGEBACK_" + moment().format('YYYYMMDD_HHmmss'));
      swal({
        type: 'success',
        text: "Exportação realizada com sucesso!",
        target: "body"
      });

      dados = null;
    }, error => {
      swal({
        type: "error",
        text: "Ocorreu um erro na exportação favor entrar em contato com o administrador do sistema",
        target: "body"
      });
    });

  }

  gerar() {
    $('.export-visible').addClass('show');
    $('#chargeback-detalhe').tableExport({
      fileName: 'chargeback', type: 'xls',
      jspdf: {
        orientation: 'p',
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
    $('.export-visible').removeClass('show');
  }

  gerarXls(dataI, dataF) {
    let nomeRelatorioJasper: string = "relChargebacksXLS";
    let qtdeRegistros: string = this.total.toString();
    let listaParametros = [];
    dataI = this.formulario.get('dataInicio').value;
    dataI = dataI.substr(6, 4) + "" + dataI.substr(3, 2) + "" + dataI.substr(0, 2);
    dataF = this.formulario.get('dataFinal').value;
    dataF = dataF.substr(6, 4) + "" + dataF.substr(3, 2) + "" + dataF.substr(0, 2);
    if (dataI.length == 8) {
      let campoValor = {
        nome: "dataRecepcaoChargebackInicial",
        valor: dataI
      };
      listaParametros.push(campoValor);
    }
    if (dataF.length == 8) {
      let campoValor = {
        nome: "dataRecepcaoChargebackFinal",
        valor: dataF
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('plano').value != null) {
      let campoValor = {
        nome: "idPlano",
        valor: this.formulario.get('plano').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('proposta').value != null) {
      let campoValor = {
        nome: "idProposta",
        valor: this.formulario.get('proposta').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('serie').value != null) {
      let campoValor = {
        nome: "idSerie",
        valor: this.formulario.get('serie').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('titulo').value != null) {
      let campoValor = {
        nome: "idTitulo",
        valor: this.formulario.get('titulo').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('parcela').value != null) {
      let campoValor = {
        nome: "parcela",
        valor: this.formulario.get('parcela').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('cpf').value != null) {
      let campoValor = {
        nome: "cpfCnpj",
        valor: this.formulario.get('cpf').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('cnpj').value != null) {
      let campoValor = {
        nome: "cpfCnpj",
        valor: this.formulario.get('cnpj').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('situacao').value != null) {
      let campoValor = {
        nome: "idStatusChargeback",
        valor: this.formulario.get('situacao').value.toString()
      };
      listaParametros.push(campoValor);
    }
    if (this.formulario.get('tipoPessoa').value != null) {
      let campoValor = {
        nome: "tipoPessoa",
        valor: this.formulario.get('tipoPessoa').value.toString()
      };
      listaParametros.push(campoValor)
    }
    if (this.formulario.get('parceiro').value != null) {
      let campoValor = {
        nome: "idProduto",
        valor: this.formulario.get('parceiro').value.toString()
      };
      listaParametros.push(campoValor);
    }

    let dados: exportaChargebackPdf = new exportaChargebackPdf(listaParametros, qtdeRegistros, nomeRelatorioJasper);

    this.relatorio.exportaExcelChargeback(dados).subscribe(response => {

      saveAs(response, "REL_CHARGEBACK_" + moment().format('YYYYMMDD_HHmmss'));
      swal({
        type: 'success',
        text: "Exportação realizada com sucesso!",
        target: "body"
      });

      dados = null;
    }, error => {
      swal({
        type: "error",
        text: "Ocorreu um erro na exportação favor entrar em contato com o administrador do sistema",
        target: "body"
      });
    });
  }

  mostraEditor(indice, indiceCpfCnpj, indiceStatus, indicePlano,
    indiceSerie, indiceTitulo, indiceStatusChargeback, indiceNsu,
    indiceAutorizacao, indiceSeqPedido) {
    if (this.showEdicao == true) {
      this.showEdicao = false;
      this.loadDados = false;
      this.mostrarBotao = false;
      this.nome = indice;
      this.cpfCnpjCharg = indiceCpfCnpj;
      this.statusCharg = indiceStatus;
      this.planoCharg = indicePlano;
      this.serieCharg = indiceSerie;
      this.tituloCharg = indiceTitulo;
      this.statusChargeback = indiceStatusChargeback;
      this.nsuChargeback = indiceNsu;
      this.numAutorizacaoChargeback = indiceAutorizacao
      this.seqPedido = indiceSeqPedido;
      return (this.nome, this.cpfCnpjCharg, this.statusCharg, this.planoCharg, this.serieCharg,
        this.tituloCharg, this.statusChargeback, this.nsuChargeback, this.numAutorizacaoChargeback, this.seqPedido);
    }
    if (this.showEdicao == false) {
      this.showEdicao = true;
    }
  }

  timeDiff: any;
  diffDays: any;
  diff: any;

  public criticidade(dataConsulta) {
    let dataFormatada = new Date(dataConsulta);
    this.timeDiff = Math.abs(dataFormatada.getTime() - this.data.getTime());

    this.diffDays = Math.ceil(this.timeDiff / (1000 * 3600 * 24));
    this.diff = 7 - this.diffDays;

    if (this.diff >= 5) { //se diff for 7 a 5 será verde
      return this.diff >= 5 ? "#28a745" : "black";
    }
    if (this.diff <= 4 && this.diff >= 3) {  // se diff for 4 a 3 será amarelo 

      return this.diff <= 4 && this.diff >= 3 ? "#ffc107" : "black";
    }
    if (this.diff <= 2 && this.diff >= 0) { // se diff for 2 a 0 será vermelho 
      return this.diff <= 2 && this.diff >= 0 ? "#dc3545" : "black";
    }
    if (this.diff < 0) {
      this.diff = 0;
      return this.diff == 0 ? "#dc3545" : "black";
    }

  }

  public formataStatus(descStatus) {
    if (descStatus == 'Em análise') {
      return descStatus == 'Em análise' ? "#ffc107" : "white";
    }
    if (descStatus == 'Recusado') {
      return descStatus == 'Recusado' ? "#d9534f" : "white";
    }
    if (descStatus == 'Acatado') {
      return descStatus == 'Acatado' ? "#428bca" : "white";
    }
    if (descStatus == 'Expirado') {
      return descStatus == 'Expirado' ? "#f2a719" : "white";
    }
    if (descStatus == 'Recebido') {
      return descStatus == 'Recebido' ? "#5cb85c" : "white";
    }
  }

  reset() {
    if (this.loadDados == true) {
      this.loadDados = false;
      this.showEdicao = true;
      this.formulario.reset();
      this.obrigatorio = null;
    }
  }

  voltarMenu() {
    this.loadDados = true;
    this.showEdicao = true;
  }

  desbloqueia: boolean = false;

  mudaSinal() {
    this.desbloqueia = true;
  }

  /**
   * ESTE MÉTODO REALIZA UMA LÓGICA EM QUE CONFORME O VALOR DE this.obrigatorio SE MODIFICA
   * OS CAMPOS OBRIGATÓRIOS SERÃO OUTROS, OU SEJA, A LÓGICA ESTÁ AMARRADA A CADA VEZ QUE O
   * VALOR DESSA VARIÁVEL É MODIFICADO.
   */
  verificaForm(inicio, fim, dataPrevisaoDebitoInicio, dataPrevisaoDebitoFim, dataDebitoEfetivoInicio, dataDebitoEfetivoFim) {

    if (this.obrigatorio == 0 || this.obrigatorio == 1) {
      if (!inicio || !fim) {
        return true;
      }
    }
    if (this.obrigatorio == 0 || this.obrigatorio == 9) {
      if (!dataPrevisaoDebitoInicio || !dataPrevisaoDebitoFim) {
        return true;
      }
    }
    if (this.obrigatorio == 0 || this.obrigatorio == 10) {
      if (!dataDebitoEfetivoInicio || !dataDebitoEfetivoFim) {
        return true;
      }
    }
    if (this.obrigatorio == 2) {
      if (!inicio || !fim || this.formulario.get('situacao').value == 0 || this.formulario.get('situacao').value == null) {
        return true;
      }
    }
    if (this.obrigatorio == 3) {
      if (!inicio || !fim || this.formulario.get('parcela').value == null || this.formulario.get('parcela').value == "") {
        return true;
      }
    }
    if (this.obrigatorio == 4) {

      if (!inicio || !fim || this.formulario.get('parceiro').value == 0 || this.formulario.get('parceiro').value == null) {
        return true;
      }
    }
    if (this.obrigatorio == 5) {
      if (this.formulario.get('parceiro').value == 0 || this.formulario.get('parceiro').value == null
        || this.formulario.get('plano').value == 0 || this.formulario.get('plano').value == null
        || this.formulario.get('proposta').value == null || this.formulario.get('proposta').value == 0) {
        return true;
      }
    }
    if (this.obrigatorio == 6) {
      if (!inicio || !fim || this.formulario.get('plano').value == 0 || this.formulario.get('plano').value == null) {
        return true;
      }
    }
    if (this.obrigatorio == 7) {

      if (this.formulario.get('plano').value == 0 || this.formulario.get('plano').value == null
        || this.formulario.get('titulo').value == null || this.formulario.get('titulo').value == ""
        || this.formulario.get('serie').value == null || this.formulario.get('serie').value == "") {
        return true;
      }
    }
    if (this.obrigatorio == 8) {
      if (this.filtroPessoa == null) {
        if (this.formulario.get('cpf').value == null || this.formulario.get('cpf').value == ""
          || this.formulario.get('cpnj').value == null || this.formulario.get('cnpj').value == "") {
          return true;
        }
      }
      if (this.filtroPessoa == 'PF') {
        if (this.formulario.get('cpf').value == null || this.formulario.get('cpf').value == "") {
          return true;
        }
      }
      if (this.filtroPessoa == 'PJ') {
        if (this.formulario.get('cnpj').value == null || this.formulario.get('cnpj').value == "") {
          return true;
        }
      }
    }

  }

  /**
   * ESTE GRUPO DE MÉTODOS SÃO REFERENTES AOS MÉTODOS DE PAGINAÇÃO DE GRIDS.
   * NA PARTE DE CIMA DO CÓDIGO HÁ O TOTAL DE REGISTROS, DE QUAL REGISTRO
   * A PAGINAÇÃO COMEÇA E DE QUAL ELA TERMINARÁ, A CADA PÁGINA PASSADA PARA
   * FRENTE, OS VALORES SÃO INCREMENTADOS, E A CADA PÁGINA PASSADA PARA TRÁS
   * OS VALORES SÃO DECREMENTADOS.
   */
  goToPage(n) {
    this.page = n;
    var dtInicio = this.formulario.get('dataInicio').value;
    var dtFinal = this.formulario.get('dataFinal').value;
    var dataIPrev = this.formulario.get('dataPrevisaoDebitoInicio').value;
    var dataFPrev = this.formulario.get('dataPrevisaoDebitoFinal').value;
    var dataIDebito = this.formulario.get('dataDebitoEfetivoInicio').value;
    var dataFDebito = this.formulario.get('dataDebitoEfetivoFinal').value;
    this.consultarChargeback(dtInicio, dtFinal, dataIPrev, dataFPrev, dataIDebito, dataFDebito);
  }

  onNext(): void {
    this.page++;
    var dtInicio = this.formulario.get('dataInicio').value;
    var dtFinal = this.formulario.get('dataFinal').value;
    var dataIPrev = this.formulario.get('dataPrevisaoDebitoInicio').value;
    var dataFPrev = this.formulario.get('dataPrevisaoDebitoFinal').value;
    var dataIDebito = this.formulario.get('dataDebitoEfetivoInicio').value;
    var dataFDebito = this.formulario.get('dataDebitoEfetivoFinal').value;
    this.consultarChargeback(dtInicio, dtFinal, dataIPrev, dataFPrev, dataIDebito, dataFDebito);
  }

  onPrev(): void {
    this.page--;
    var dtInicio = this.formulario.get('dataInicio').value;
    var dtFinal = this.formulario.get('dataFinal').value;
    var dataIPrev = this.formulario.get('dataPrevisaoDebitoInicio').value;
    var dataFPrev = this.formulario.get('dataPrevisaoDebitoFinal').value;
    var dataIDebito = this.formulario.get('dataDebitoEfetivoInicio').value;
    var dataFDebito = this.formulario.get('dataDebitoEfetivoFinal').value;
    this.consultarChargeback(dtInicio, dtFinal, dataIPrev, dataFPrev, dataIDebito, dataFDebito);
  }

  onFirst(): void {
    this.page = 1;
    var dtInicio = this.formulario.get('dataInicio').value;
    var dtFinal = this.formulario.get('dataFinal').value;
    var dataIPrev = this.formulario.get('dataPrevisaoDebitoInicio').value;
    var dataFPrev = this.formulario.get('dataPrevisaoDebitoFinal').value;
    var dataIDebito = this.formulario.get('dataDebitoEfetivoInicio').value;
    var dataFDebito = this.formulario.get('dataDebitoEfetivoFinal').value;
    this.consultarChargeback(dtInicio, dtFinal, dataIPrev, dataFPrev, dataIDebito, dataFDebito);
  }

  onLast(): void {
    this.page = Math.ceil(this.total / this.limit) || 0;;
    var dtInicio = this.formulario.get('dataInicio').value;
    var dtFinal = this.formulario.get('dataFinal').value;
    var dataIPrev = this.formulario.get('dataPrevisaoDebitoInicio').value;
    var dataFPrev = this.formulario.get('dataPrevisaoDebitoFinal').value;
    var dataIDebito = this.formulario.get('dataDebitoEfetivoInicio').value;
    var dataFDebito = this.formulario.get('dataDebitoEfetivoFinal').value;
    this.consultarChargeback(dtInicio, dtFinal, dataIPrev, dataFPrev, dataIDebito, dataFDebito);
  }
}
