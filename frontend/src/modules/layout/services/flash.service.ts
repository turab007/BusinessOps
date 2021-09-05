import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Injectable()
export class FlashService {

  static instance: FlashService;

  constructor() {
    return FlashService.instance = FlashService.instance || this;
  }

  // Observable string sources
  private flashSubject = new Subject<Object>();

  flash$ = this.flashSubject.asObservable();

  setFlashMessage(subject: string, message: string) {
    this.flashSubject.next({ subject: subject, message: message });
  }

  clearFlash() {
    this.flashSubject.next();
  }

  getFlash(): Observable<any> {
    return this.flashSubject.asObservable();

  }

}