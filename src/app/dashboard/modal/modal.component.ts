import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StatusDTO } from '../dto/statusDTO';
import { Http, RequestOptions, Headers } from '@angular/http';
import { ModalService } from './modal.service';
import { ChargebackComponent } from '../chargeback/chargeback.component';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Dados } from './dados';
import { FullLayoutComponent } from '../../portal-principal/view/full-layouts/full-layout.component';
import { Observable } from 'rxjs/Observable';
import { AuxiliarService } from '../../portal-principal/service/auxiliar.service';
import swal from 'sweetalert2';

// const URL = '/api/';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {

  situacao: StatusDTO;
  editor: FormGroup;
  mostraUpload: boolean = false;
  carregandoStatus: boolean = false;
  closed: boolean = true;
  carregar: boolean = false;
  mensagemOut: boolean = false;
  public maskMask;

  constructor(
    private http: Http,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private chargeback: ChargebackComponent,
    private auxiliar: AuxiliarService,
    private fullLayout: FullLayoutComponent) { }

  index = this.chargeback.nome;
  cpfCnpj = this.chargeback.cpfCnpjCharg;
  estado = this.chargeback.statusCharg;
  plano = this.chargeback.planoCharg;
  serie = this.chargeback.serieCharg;
  titulo = this.chargeback.tituloCharg;
  estadoCharg = this.chargeback.statusChargeback;
  nsuCharg = this.chargeback.nsuChargeback;
  idStatusCharg: any;
  numAutorizacao = this.chargeback.numAutorizacaoChargeback;
  seqPedido = this.chargeback.seqPedido;

  idStatus: string; // V
  descDefChargeback: string; // V
  nAut: string;
  nsu: string; // V
  usuario: any; // V
  arch: File; //V
  seqPed: any;

  mensagem: string;
  resposta: boolean = true;

  ngOnInit() {

    this.editor = this.formBuilder.group({
      descricao: [null, [Validators.required, Validators.minLength(10)]],
      status: [null],
      upload: [null]
    });

    this.callStatus();
    this.formataCpfCnpj();
  }

  alterarChargeback() {
    this.resposta = false;
    this.getIdStatus();
    //console.log(this.editor.value);
    //console.log(this.editor.get('upload').value);
    this.mostraUpload = false;
    //console.log(this.editor.get('upload').value.size);
    this.carregar = true;
    this.nsu = this.nsuCharg;
    this.idStatus = this.idStatusCharg;
    this.arch = this.editor.get('upload').value;
    this.descDefChargeback = this.editor.get('descricao').value;
    this.nAut = this.numAutorizacao;
    this.usuario = this.fullLayout.nomeLogin;
    this.seqPed = this.seqPedido;
    //console.log("nsu >>" + this.nsu + "     idStatus >>" + this.idStatus +
    //"     descricao >>" + this.descMotRecusa +
    //"     nAut >>" + this.nAut + "     usuario >>" + this.usuario);
    //console.log(this.arch);
    var dados: Dados = new Dados(this.usuario, this.nsu, this.nAut, this.idStatus, this.descDefChargeback, this.arch, this.seqPed);

    /*
    * chargeback em análise
    */
    if (this.editor.get('upload').value == null &&
      this.editor.get('descricao').value == null) {

      let formData: FormData = new FormData();
      formData.append('arquivo', this.arch, '');
      formData.append('idStatusChargeback', this.idStatus);
      formData.append('descricaoDefesaChargeback', ' ');
      formData.append('numAutorizacao', this.nAut);
      formData.append('nsu', this.nsu);
      formData.append('usuario', this.usuario);
      formData.append('seqPedido', this.seqPed);

      let headers = new Headers();
      headers.set('Accept', 'application/json');

      let options = new RequestOptions({ headers: headers });

      this.http.post(this.auxiliar.postUpload(), formData, options).map(res => {

        console.log("res", res);

        swal({
          title: 'Chageback alterado com sucesso.',
          type: 'success',
          confirmButtonText: 'OK'
        });

        this.chargeback.showEdicao = true;
        this.resposta = true;
        

      }).catch(error => Observable.throw(error)).subscribe(data => {
        console.log('uploaded!');
      }, error => {
        swal({
          title: 'Não foi possível alterar o status.',
          type: 'error',
          confirmButtonText: 'OK'
        });

        console.log(error);

        this.chargeback.showEdicao = false;

        this.resposta = true;
      });
    }

    /*
    * chargeback acatado
    */
    if (this.editor.get('upload').value == null && this.editor.get('descricao').value != null) {

      let formData: FormData = new FormData();
      formData.append('arquivo', this.arch, '');
      formData.append('idStatusChargeback', this.idStatus);
      formData.append('descricaoDefesaChargeback', this.descDefChargeback);
      formData.append('numAutorizacao', this.nAut);
      formData.append('nsu', this.nsu);
      formData.append('usuario', this.usuario);
      formData.append('seqPedido', this.seqPed);

      let headers = new Headers();
      headers.set('Accept', 'application/json');

      let options = new RequestOptions({ headers: headers });

      this.http.post(this.auxiliar.postUpload(), formData, options).map(res => {

        console.log("res", res);

        swal({
          title: 'Chageback alterado com sucesso.',
          type: 'success',
          confirmButtonText: 'OK'
        });

        this.chargeback.showEdicao = true;
        this.resposta = true;
        

      }).catch(error => Observable.throw(error)).subscribe(data => {
        console.log('uploaded!');
      }, error => {
        swal({
          title: 'Não foi possível alterar o status.',
          type: 'error',
          confirmButtonText: 'OK'
        });

        console.log(error)
        this.chargeback.showEdicao = false;
        this.resposta = true;
      });
    }

    /*
    * chargeback recusado
    */
    if (this.editor.get('upload').value.size <= 1750000 && this.editor.get('upload').value.type === 'image/tiff') {

      let formData: FormData = new FormData();
      formData.append('arquivo', this.arch, this.editor.get('upload').value.name);
      formData.append('idStatusChargeback', this.idStatus);
      formData.append('descricaoDefesaChargeback', this.descDefChargeback);
      formData.append('numAutorizacao', this.nAut);
      formData.append('nsu', this.nsu);
      formData.append('usuario', this.usuario);
      formData.append('seqPedido', this.seqPed);

      console.log(formData);

      let headers = new Headers();
      headers.set('Accept', 'application/json');

      let options = new RequestOptions({ headers: headers });

      this.http.post(this.auxiliar.postUpload(), formData, options).map(res => {

        console.log('res', res);

        swal({
          title: 'Arquivo enviado com sucesso.',
          type: 'success',
          confirmButtonText: 'OK'
        });

        this.resposta = true;
        this.chargeback.showEdicao = true;
        this.editor.reset();
        
      }).catch(error => Observable.throw(error)).subscribe(data => {
        console.log('uploaded!');
      }, (error => {
        swal({
          title: 'Arquivo não foi enviado.',
          type: 'error',
          confirmButtonText: 'OK'
        });

        console.log(error);

        this.chargeback.showEdicao = false;
        this.resposta = true;
        this.editor.get('upload').reset();
      })
      );
    }

    if (this.editor.get('upload').value.size > 1750000) {

      swal({
        title: 'Você não pode enviar arquivos acima de 7MB.',
        type: 'error',
        confirmButtonText: 'OK'
      });

      this.chargeback.showEdicao = false;
      this.resposta = true;
      this.editor.get('upload').reset();
    }

    if (this.editor.get('upload').value.type !== 'image/tiff') {

      swal({
        title: 'Você não pode enviar arquivos deste tipo apenas .tiff!',
        type: 'error',
        confirmButtonText: 'OK'
      });

      this.chargeback.showEdicao = false;
      this.resposta = true;
      this.editor.get('upload').reset();
    }

    
  }

  getIdStatus() {
    if (this.editor.get('status').value === 'Em análise') {
      this.idStatusCharg = 2;
      return this.idStatusCharg;
    }
    if (this.editor.get('status').value === 'Recusado') {
      this.idStatusCharg = 3;
      return this.idStatusCharg;
    }
    if (this.editor.get('status').value === 'Acatado') {
      this.idStatusCharg = 4;
      return this.idStatusCharg;
    }
  }

  formataCpfCnpj() {
    if (this.cpfCnpj.length === 11) {
      console.log(`${this.cpfCnpj.substr(0, 3)}.${this.cpfCnpj.substr(3, 3)}.${this.cpfCnpj.substr(6, 3)}-${this.cpfCnpj.substr(9, 2)}`);

      this.cpfCnpj = this.cpfCnpj.substr(0, 3) + '.' + this.cpfCnpj.substr(3, 3) + '.' + this.cpfCnpj.substr(6, 3) + '-' +
        this.cpfCnpj.substr(9, 2);
    }
    if (this.cpfCnpj.length > 14) {
      this.cpfCnpj = this.cpfCnpj.substr(0, 2) + '.' + this.cpfCnpj.substr(2, 3) + '.' + this.cpfCnpj.substr(5, 3) + '/' +
        this.cpfCnpj.substr(8, 4) + '-' + this.cpfCnpj.substr(12, 2);
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
      console.log(error);
    });
  }

  myFile: File;

  fileChange(files: any) {
    console.log(files);
    this.myFile = files[0];
    console.log(this.myFile.type);
    console.log(this.myFile);
    this.editor.patchValue({
      upload: this.myFile
    });

    if (this.editor.get('upload').value != null) {
      this.closed = true;
    }
  }

  fechar() {
    this.mostraUpload = false;
    this.closed = false;
    this.editor.patchValue({
      upload: null
    });
  }

  verifica(valor) {
    this.carregar = false;
    console.log(valor.target.value);
    if (valor.target.value === 'Em análise' || valor.target.value === 'Acatado' || valor.target.value === null) {
      this.editor.patchValue({
        descricao: null
      });
    }

    if (valor.target.value === 'Em análise' || valor.target.value === 'Acatado') {
      this.mostraUpload = false;
      this.closed = true;
    }
  }
  // tslint:disable-next-line:eofline
}