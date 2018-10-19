import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import * as global from '../../../comuns/global';

import { AlertService } from './../../../service/alert.service';
import { AuthService } from './../../service/auth.service';
import { UsuarioService } from './../../service/usuario.service';

import { Menu } from '../../models/menu';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.min.css']
})

export class FullLayoutComponent implements OnInit {
  usuario: any;
  nomeUsuarioLogado: any;
  menus: any;
  menusInsert: any = [];
  nomeUsu: string;
  nomeLogin: string;

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };
  public plataformaAtual: any;

  constructor(private authService: AuthService, private router: Router,
    private usuarioService: UsuarioService) { }

  refresh(): void {
    window.location.reload();
  }

  ngOnInit() {

    if (!localStorage.getItem(global.userSession)) {
      this.router.navigate(['/login']);
    } else {
      sessionStorage.setItem(global.userSession, localStorage.getItem(global.userSession));
    }

    this.usuario = global.recuperaUsuarioSession();
    this.usuarioService.setToken(this.usuario.token);

    this.usuarioService.consultarToken().subscribe(res => {
      this.nomeUsu = res.listaUsuario[0].nomeUsuario;
      this.nomeLogin = res.listaUsuario[0].login;
      return this.nomeLogin;
    }, error => { });

    if (this.usuario.menu != undefined) {
      this.menus = this.usuario.menu;
    }

    var context = this;

    $('#sortable').sortable({
      revert: true,
      beforeStop: function () {
        context.inserirMenu(context.obterArrayMenusTela());
      }
    });
    $('ul, li').disableSelection();
  }

  private obterArrayMenusTela() {

    var qtd = $('#sortable').children().length;
    this.menusInsert = [];

    for (var i = 0; i < qtd; i++) {
      var menuGraggable = $($('#sortable').children()[i]).attr('id')
      for (var j = 0; j < this.menus.length; j++) {
        if (menuGraggable && menuGraggable.toUpperCase() == this.menus[j].nome.toUpperCase()) {
          this.menusInsert.push(this.menus[j]);
        }
      }
    }
    return this.menusInsert;
  }

  private inserirMenu(menus) {

    var menuInsert: Menu = new Menu();
    menuInsert.idUsuario = this.usuario._id;
    menuInsert.plataforma = global.plataforma;
    menuInsert.menu = menus;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  private ngDoCheck() {

    $(document).ready(function () {

      $('a[data-toggle]').click(function () {
        var linkPai = $(this).attr('href');
        $('ul[data-toggle-child]').removeClass('in');
        $('#' + linkPai).toggleClass('in');
      });

      $('#drawer-menu').hover(function ($event) {
        $('#drawer-menu').addClass('aberto');
        $event.stopPropagation();

      });

      $('#page-wrapper').hover(function ($event) {
        $('#drawer-menu').removeClass('aberto');
        $('ul[data-toggle-child]').removeClass('in');
        $event.stopPropagation();

      });
    });
  }

  toggleMenu() {

    if ($(window).width() < 768) {
      $('#drawer-menu').toggleClass('aberto');
      $('#fundo-escuro').toggleClass('aberto');
    }

  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  logout() {
    this.authService.logout();
  }
}