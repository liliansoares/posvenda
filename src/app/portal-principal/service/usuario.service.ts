import { AuthSecurityService } from './auth-security.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { AppConfig } from "../../app.config";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Usuario } from "../models/usuario";
import { AuxiliarService } from "./auxiliar.service";
import * as global from '../../comuns/global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UsuarioService {

    endPointlistar = "usuarios";
    endPointAdicionar = "usuarios";
    endPointAtualizar = "usuarios";
    endPointMenu = "ordens-menu"
    token: string;

    private service:AuxiliarService;
    public usuarioSelecionado : Usuario;
    public authSecurityService:AuthSecurityService;
    
    public novoUsuario : Usuario;

    private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public loggedIn: Observable<boolean> = this._loggedIn.asObservable();
    
    constructor(private _http: Http, 
                private config: AppConfig
                 ) {
        this.service = new AuxiliarService(_http);
     }
    
    adicionar (usuario: any , tag?: string) {       
        
        let body = usuario;
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());
    }

    alterar(usuario: any) {      
        let body = usuario;
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());

    }

    deletar(id: any) {
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());

    }

    listar() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());

    }

    listarMenus(menus:any) {

        let body = menus;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());

    }

    listarMenusGTA(token:any) {  /////CARTAO DE CRÉDITO (((((LISTAR GRUPOS))))) NOME DO GRUPO CARTÃO DE CRÉDITO.
        // console.log(">>>> CHAMOU O LISTAR MENU GTA");
        // console.log(">>>> token: " + token);
        setTimeout( function() {  }, 600000);
         var url = this.service.getUriModulosGTA();
        // console.log(">>>> URL LISTAR MENUS GTA: " + url);
         
         var headers = new Headers();
         headers.append('Content-Type', 'application/json');
         headers.append("TOKEN", token);
         
         return this._http.get(url, { "headers": headers })
             .map(res =>res.json());
     }

    listarFuncionalidadesGTA(token:any, modulo) {   /////SUBMENU DE CHARGEBACK  
       // console.log(">>>> CHAMOU A LISTAR FUNCIONALIDADES GTA");
       // console.log(">>>> token: " + token);
       // console.log(JSON.stringify(modulo));           
       
        var url = this.service.getUriFuncionalidadesGTA()+`idModulo=${modulo}`;
        // console.log(url);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("TOKEN", token);
        
        
            return this._http.get(url, { "headers": headers })
                .map(res =>res.json());
    
    }

    listarAcoesGTA(chave:any, token: any) {   //////////// AÇÕES QUE O USUARIO 
        var url = this.service.getUriAcoesGTA() + chave;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("TOKEN", token);

        return this._http.get(url, { "headers": headers })
            .map(res => res.json());
    }

    consultarToken(){
        var url = this.service.getUrlConsultarToken();
        
        return this._http.get(url, {headers: this.getDefaultToken() }).map(res =>{
            //console.log(">>>>>>> ******* &&&&&&& " + res.json().listaUsuario[0].nomeUsuario);
            return res.json();
        });
    }

    setToken(paramToken){
        this.token = paramToken;
    }

    private getDefaultToken(){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('token', this.token);
        return headers;
    }

    SalvarMenus(menus:any) {
        let body = menus;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("authorization", this.service.getAuth());
    }

    public getUsuarioSelecionado(): Usuario {
        return this.usuarioSelecionado;
    }

    public setUsuarioSelecionado(usuario: any): void {
        this.usuarioSelecionado = usuario;
    }

    public getNovoUsuario(){
        return this.novoUsuario;
    }

    public setNovoUsuario(usuario:any){
        this.novoUsuario = usuario;
    }
}
