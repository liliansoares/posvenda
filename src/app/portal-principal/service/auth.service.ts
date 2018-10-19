import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

import * as global from '../../comuns/global';

@Injectable()
export class AuthService {

  subject = new Subject<any>();

  endPoint = 'login';

  constructor(private router: Router) { }

  notificar(res: any) {
    this.subject.next(res);
  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem(global.userSession);
    this.router.navigate(['/login']);
  }

  getUsuario(): Observable<any> {
    return this.subject.asObservable();
  }
}