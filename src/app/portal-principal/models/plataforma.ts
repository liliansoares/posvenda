import { Usuario } from './usuario';
import { Modulo } from './modulo';
import * as moment from 'moment/moment';

export class Plataforma {
    nome: string;
    _id : string;
    modulos : Array<Modulo> = new Array();
    created_at : string
    bloqueado : boolean 
    usuarios_permitidos : Array<Usuario> = new Array()
    
    constructor(){
        if( this.created_at == null ) {
            let date = new Date()
            this.created_at = moment().format('DD/MM/YYYY')
        }
        if(this.bloqueado == null) {
            this.bloqueado = false
        }
    }
}