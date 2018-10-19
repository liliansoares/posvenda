import { plataforma } from '../../comuns/global';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { AppConfig } from '../../app.config';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Plataforma } from '../models/plataforma';
import { AuxiliarService } from "./auxiliar.service";
import { UsuarioService } from './usuario.service';


@Injectable()
export class PlataformaService {

    //registraPlataforma = "registraPlataforma";
    endPointlistar = "plataformas";
    endPointExclusao = "plataforma-itens-plataforma";
    private service: AuxiliarService;
    private exclusao: any = [];
    public plataformaSelecionada: Plataforma;

    constructor(private _http: Http, private config: AppConfig, private usuarioService: UsuarioService) {
        this.service = new AuxiliarService(_http);
    }

    adicionar(plataforma: Plataforma) {
        delete plataforma._id
        let body = JSON.stringify(plataforma);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());
        let url;
        if (this.exclusao.length > 0) {
            let i = 0;
            while (i < (this.exclusao.length - 1)) {
                this._http.post(url /*+ this.token*/, this.exclusao[i], { "headers": headers })
                    .map(res => res.json());
                i++;
            }   
            return this._http.post(url /*+ this.token*/, this.exclusao[i], { "headers": headers })
                .map(res => {res.json(); this.exclusao = []});


        } else {
            return this._http.post(url /*+ this.token*/, body, { "headers": headers })
                .map(res => res.json());
        }
    }

    update(plataforma : Plataforma) {
        delete plataforma._id
        let body = JSON.stringify(plataforma);
        //console.log(body)
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());
    }

    delete(plataforma : Plataforma) {
       
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());

    }

    listar() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());
    }

    public getPlataformaSelecionada(): Plataforma {
        return this.plataformaSelecionada;
    }

    public setPlataformaSelecionada(plataforma: any): void {
        this.plataformaSelecionada = plataforma;
    }

    public getPlataformaExcluida(nomePlataforma, modulo) {
        let obj: any = {};
        obj.item = "modulos";
        obj.nomePlataforma = nomePlataforma;
        obj.nomeModulo = modulo.nome;
        this.exclusao.push(obj);
        console.log(this.exclusao);
    }


}
