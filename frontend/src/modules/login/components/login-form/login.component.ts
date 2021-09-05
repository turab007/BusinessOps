import { Component, OnInit }      from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import {  LoginService } from '../../services/login.service';
import { Login } from '../../viewmodels/login.model';

@Component({
  selector: 'login-root',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css','../../stylesheets/login-styles.css']
})

export class LoginComponent implements OnInit { 
    
    public model: Login = new Login();
    public errorMsg: string = ''

    constructor(private router: Router, private _loginService: LoginService) {
    }
    ngAfterViewInit() {
        // this.email.focus();
    }

    ngOnInit() {
    }

    onSubmit() {
        // this.router.navigate(['dashboard']);
        this._loginService.authenticateUser(this.model.email, this.model.password).subscribe((result) => {
            if (result) {
                this.router.navigate(['dashboard']);
            }
        }, error => {
            this.errorMsg = error;
        });
    }
}