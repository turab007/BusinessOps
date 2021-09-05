import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { LoginService } from 'modules/login/services/login.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {

        let url = route.url[0];
        if (!this.loginService.isLoggedIn()) {
            this.router.navigate(['auth/login']);
        }
        //NOTE: don't uncomment it.. It will generate infinite loop
        // else{
        //     alert('navigating');
        //     this.router.navigate(['dashboard']);
        // }
        return true;
    }
}
