import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
/**
 * TODO:HIGH (CHeck token expired or not and redirect)
 */
@Injectable()
export class TokenService {

  static instance1: TokenService;

  constructor(private router: Router) {
    return TokenService.instance1 = TokenService.instance1 || this;
  }

  // Observable string sources
  private tokenSubject = new Subject<string>();


  token$ = this.tokenSubject.asObservable();


  setTokenMessage(redirect: boolean) {

    // TODO:low: jwt expired message should not be string base comparison
    if (redirect) {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }

    this.tokenSubject.next('');

  }

  cleaToken() {
    this.tokenSubject.next();
  }

  getToken(): Observable<any> {
    return this.tokenSubject.asObservable();

  }

}