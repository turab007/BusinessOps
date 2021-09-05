import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Injectable()
export class SideNavService {

  // Observable string sources
  private navOpen = new Subject<boolean>();
  nav$ = this.navOpen.asObservable();


  setNav(nav: boolean) {
    this.navOpen.next(nav);
  }

  clearMenu() {
    this.navOpen.next();
  }

}