import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AuxiliarService } from "./auxiliar.service";
import { AuthInfo } from './auth-info';

@Injectable()
export class AuthSecurityService {

  private addUrl: string;
  private addURI: string;
  private addUrlGTA: string;
  private headers = new Headers();
  isLocal: any;
  isAcessoValid: Boolean;
  private _aux:AuxiliarService;

  constructor(private http: Http) {
    this._aux = new AuxiliarService(http);
    this.addUrlGTA = this._aux.getUriLoginGTA();  }

  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthSecurityService.UNKNOWN_USER);
  
  autentica(usuario: any): Observable<any> {

    var usuarioLogin = {
      "login": usuario.email,
      "senha": usuario.senha,
      "plataforma": "Serviços"
    }

    this.addURI = 'login';
    return this.http.put(this.addUrlGTA, usuarioLogin)
      .map(res => res.json())
      .catch(this.handleError);
    
  }

  private handleError(error: any): Promise<any> {
    console.error('an error occured', error); //for demo purposes only
    return Promise.reject(error.message || error);
  }
}
