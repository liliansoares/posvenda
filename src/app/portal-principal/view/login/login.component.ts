import { AuthSecurityService } from '../../service/auth-security.service';

import { Component, OnInit } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Login } from '../../models/login';
import { PropertiesService } from './../../../service/properties.service';
import { UsuarioService } from '../../service/usuario.service';

import { Mensagem } from "./../../../model/mensagem";
import { Menu } from '../../models/menu';
import * as global from './../../../comuns/global';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.min.css']
})

export class LoginComponent implements OnInit {
  n: number;
  loading: boolean
  _plataforma = global.plataforma;
  //_plataforma = 'gta';
  public isRequesting: boolean;
  usuario: Login;
  usuarios: Login[]
  msg: Mensagem;
  campo: string;
  campoErro: string;
  senha: any;
  menu: Menu
  private _proper: PropertiesService;

  private authSecurityService: AuthSecurityService;
  public itemTeste: any;
  public itemSegundoTeste: any;


  loginForm: FormGroup;
  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


  constructor(private router: Router, private http: Http, 
    private formBuilder: FormBuilder, private usuarioService: UsuarioService) {
      
     }

     login(usuario: Login) {
    
      console.log(">>>> INICIO LOGIN ");
  
      this.authSecurityService = new AuthSecurityService(this.http);
      this.loading = true;
      usuario.plataforma = this._plataforma;
  
      var menu = [];
      var acoes = [];
    
      // serviço de login gta
      this.authSecurityService.autentica(usuario).subscribe(resp1 => {
  
        console.log(">>> Inicio Autenticação ");
  
        if (resp1) {
          if (resp1.codigoRetorno == "1") {
            this.msg.title = "Usuário/senha incorreto!";
            this.msg.text = "Usuário/senha incorreto!";
            this.loading = false;
          } else if (resp1.codigoRetorno == "0") {
  
            // serviço de listar modulo por plataforma
           this.usuarioService.listarMenusGTA(resp1.descricaoRetorno).subscribe(res => {

              console.log(">>> MODULOS: " );

              if (res.codigoRetorno == 1) {
                this.msg.title = "Usuário sem acesso à plataforma!";
                this.msg.text = "Usuário sem acesso à plataforma!";
                this.loading = false;
              } else {
                let itemMenu;
                let permissao: any = 0
                var Lista = 0;
                // serviço de listar funcionalidades por módulo
  
                /*if(res.listaGrupoModulo.length == null || res.listaGrupoModulo.length == undefined || res.listaGrupoModulo.length == 0){
                  this.msg.title = "Usuário sem acesso à plataforma!";
                  this.msg.text = "Usuário sem acesso à plataforma!";
                  this.loading = false;
                }*/
                for (let g = 0; g < res.listaGrupoModulo.length; g++) {//Grupo de Módulos
                  console.log(">>> Grupo Módulo: " + g);
  
                  for (let m = 0; m < res.listaGrupoModulo[g].modulos.length; m++) {//Módulos
                    console.log(">>> Funcionalidade " + m);
  
                    this.usuarioService.listarFuncionalidadesGTA(resp1.descricaoRetorno, res.listaGrupoModulo[g].modulos[m].idModulo).subscribe(res1 => {

                    console.log(">>> listarFuncionalidadesGTA ");
  
                      if (res1.codigoRetorno == "1") {
                        this.msg.title = "Usuário sem acesso à plataforma!";
                        this.msg.text = "Usuário sem acesso à plataforma!";
                        this.loading = false;
                      } else {
                        
  
                        res1.listaFuncionalidade.forEach(function (x) {
                          setTimeout(function () { }, 1000);
                          var url = x.url.replace('http://', '');
  
                          itemMenu = {
                            "idFunc": x.idFunc,
                            "nome": x.modulo.nomeModulo,
                            "rota": url,
                            "chave": x.chaveFuncionalidade,
                            "funcionalidades": [
                              {
                                "rota": url,
                                "uris": [
                                  "/usuarios",
                                  "/plataformas"
                                ],
                                "nome": x.nomeFunc
                              }
                            ]
                          }
                          console.log(">>> ITEM MENU: " + JSON.stringify(itemMenu));
                          menu.push(itemMenu);
                          
  
                        });
                                               
                        var usuarioLogado = {
                          "email": usuario.email.toString(), //usuario.email;
                          "token": resp1.descricaoRetorno,
                          "menu": menu
                        }
  
                        window.sessionStorage.setItem(global.userSession, JSON.stringify(usuarioLogado));
                        window.localStorage.setItem(global.userSession, JSON.stringify(usuarioLogado));
                        localStorage.setItem(global.currentUser, usuarioLogado.email);
                        localStorage.setItem(global.currentUser, '');
                        this.router.navigate(['/posvenda']);// /usuarios
                        this.router.ngOnDestroy;
                        console.log(">>> Navigate");
                        
                     
                    }
  
                    });
                    console.log(">>> MENU COMPLETO: " + JSON.stringify(menu));
                    permissao++;
                  }
                }
              }
            });
  
  
  
          }
        }
        console.log(">>> Fim Autenticação ");
  
      }, (err) => {
        try {
          this.msg.title = "Falha ao se logar!";
          this.msg.text = err.json().mensagem;
        } catch (err) {
          this.msg.text = "Favor entrar em contato com o administrador de sistema!.";
          // console.log(err);
        }
        this.loading = false;
      });
  
      console.log(">>> FIM LOGIN");
  
    }

/*
  login(usuario: Login) {
    
    this.authSecurityService = new AuthSecurityService(this.http);
    this.loading = true;
    usuario.plataforma = this._plataforma;

    var menu = [];
    var acoes = [];

    // serviço de login gta
    this.authSecurityService.autentica(usuario).subscribe(resp1 => {

      if (resp1) {
        if (resp1.codigoRetorno == "1") {
          this.msg.title = "Usuário/senha incorreto!";
          this.msg.text = "Usuário/senha incorreto!";
          this.loading = false;
        } else if (resp1.codigoRetorno == "0") {

          // serviço de listar modulo por plataforma
          this.usuarioService.listarMenusGTA(resp1.descricaoRetorno).subscribe(res => {
             console.log(JSON.stringify(res));
             console.log(">>> RETORNOOOOO: " + JSON.stringify(res))
            if(res.codigoRetorno == 1){
              this.msg.title = "Usuário sem acesso à plataforma!";
              this.msg.text = "Usuário sem acesso à plataforma!";
              this.loading = false;
            }else{
            let itemMenu;
            let permissao: any = 0
            // serviço de listar funcionalidades por módulo
           
           //if(res.listaGrupoModulo.length == null || res.listaGrupoModulo.length == undefined || res.listaGrupoModulo.length == 0){
           //  this.msg.title = "Usuário sem acesso à plataforma!";
           //  this.msg.text = "Usuário sem acesso à plataforma!";
           //  this.loading = false;
           //}
           
           //for( let i = 0; i< res.listaGrupoModulo[1].modulos.length; i++ ){
            
            this.usuarioService.listarFuncionalidadesGTA(resp1.descricaoRetorno, res.listaGrupoModulo[1].modulos[0].idModulo).subscribe(res1 => {
               console.log(res.listaGrupoModulo[1].modulos);
              if (res1.codigoRetorno == "1") {
                this.msg.title = "Usuário sem acesso à plataforma!";
                this.msg.text = "Usuário sem acesso à plataforma!";
                this.loading = false;
              } else {
                res1.listaFuncionalidade.forEach(function (x) {
                  setTimeout( function() {  }, 1000);
                  var url = x.url.replace('http://', '');
                  console.log(JSON.stringify(res1.listaFuncionalidade));
                  itemMenu = {
                    "idFunc": x.idFunc,
                    "nome": x.modulo.nomeModulo,
                    "rota": url,
                    "chave": x.chaveFuncionalidade,
                    "funcionalidades": [
                      {
                        "rota": url,
                        "uris": [
                          "/usuarios",
                          "/plataformas"
                        ],
                        "nome": x.nomeFunc
                      }
                    ]
                  }

                  menu.push(itemMenu);
                });
                
                //if(i ==  res.listaGrupoModulo[1].modulos.length - 1){
                var usuarioLogado = {
                  "email": usuario.email.toString(), //usuario.email;
                  "token": resp1.descricaoRetorno,
                  "menu": menu
                }
              
                window.sessionStorage.setItem(global.userSession, JSON.stringify(usuarioLogado));
                window.localStorage.setItem(global.userSession, JSON.stringify(usuarioLogado));
                localStorage.setItem(global.currentUser, usuarioLogado.email);
                localStorage.setItem(global.currentUser, '');
                this.router.navigate(['/dashboard']);// /usuarios
               //} 
               }

             
            });
            permissao++;
           //}
           }
          });

          

        }
      }
      
    }, (err) => {
      try {
        this.msg.title = "Falha ao se logar!";
        this.msg.text = err.json().mensagem;
      } catch (err) {
        this.msg.text = "Favor entrar em contato com o administrador de sistema!.";
        // console.log(err);
      }
      this.loading = false;
    });
  
  }
*/
  clear() {
    this.usuario = new Login();
  }


  keyDownFunction(event, usuario) {
    // console.log("Tecla pressionada >>> " + event);
    if (event.keyCode == 13) {
      if (usuario.email && usuario.senha) {
        this.login(usuario)
      }
    }
  }

  ngOnInit() {
    this.usuario = new Login();
    this.usuario.email = localStorage.getItem(global.currentUser);

    //this._proper = new PropertiesService(this.http);
    //this.usuario = new Usuario();
    this.msg = new Mensagem();
    //this._proper.carregaArquivoProperties();

    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      senha: this.formBuilder.control('', [Validators.required])
    })
  }
}