import { Plataforma } from "./plataforma";

export class Usuario {
   _id : string;
   nome: string;
   email: string;
   cpf: string;
   password: string;
   editar:number = 0;
   origem:string = 'Interno';    
   block:boolean;
   plataformas : Array<Plataforma> = new Array();
   //acesso_plataformas:Array<Plataforma> = new Array();
}