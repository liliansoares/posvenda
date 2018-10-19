import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import toastr from "toastr";
import * as global from '../comuns/global';

@Injectable()
export class MyHttp extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    //do whatever 
    if (typeof url === 'string') {
      if (!options) {
        options = { headers: new Headers() };
      }
      this.setHeaders(options);
    } else {
      this.setHeaders(url);
    }

    return super.request(url, options).catch(this.catchErrors());
  }

  private catchErrors() {
    
    return (res: Response) => {
        console.log(res)
      if (res.status === 401 || res.status === 403) {
        //handle authorization errors
        //in this example I am navigating to logout route which brings the login screen
        //this.router.navigate(['logout']);
      }
      if ( (res.status == 500 && res.json().mensagem.toLowerCase().indexOf('token') >= 0 )  || ( res.status == 404 && res.json().mensagem.toLowerCase().indexOf('token') >= 0) ) {
        toastr.options = global.globalToast
        toastr["warning"]("Sua sessão expirou, é necessário logar novamente.")
        sessionStorage.clear();
        localStorage.removeItem(global.userSession)
        this.router.navigate(['login']);
      }

      if( res.status == 503 ) {
        toastr.options = global.globalToast
        toastr["danger"]("O serviço está desligado e/ou fora do ar.")
        /*
        sessionStorage.clear();
        localStorage.removeItem(global.userSession)
        this.router.navigate(['login']);
        */
      }
      return Observable.throw(res);
    };
  }

  private setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {
    //add whatever header that you need to every request
    //in this example I add header token by using authService that I've created
    //objectToSetHeadersTo.headers.set('Token', this.authService.getToken());
  }
}