import { plataforma } from './../../../comuns/global';
import { Login } from '../../models/login';
import { Pipe, PipeTransform } from '@angular/core';
import * as global from '../../../comuns/global';

@Pipe({
  name: 'breadcrumb'
})
export class BreadcrumbPipe implements PipeTransform {

  transform(value: string , divisor?: string ): any {
    var aux = value.split("/")
    var rotareal = aux[aux.length-1]
    var rotaAtual = aux[aux.length-1].replace(/[-]/," ");

    var rotaRetorno = rotaAtual
    var plataformas = JSON.parse(sessionStorage.getItem(global.userSession)).plataformas;
    if(plataformas) {
      plataformas.forEach(plat => {
        plat.modulos.forEach(mod => {
          var arrAux = mod.funcionalidades.filter(function(f){
            if(f.rota.toLowerCase() == rotaAtual.toLowerCase() || f.rota.toLowerCase() == rotareal.toLowerCase()) {
              return f
            }
          });
          if(arrAux.length >= 1) {
            rotaRetorno = arrAux[0].nome;
          }
        });
        
            
      });
    }
    
    return rotaRetorno;
  }

}
