import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { EventEmitter, Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Login } from './../viewmodels/login.model';
import { ResetPassword } from './../viewmodels/reset-password.model';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class PasswordAndVerificationService {

    apiUrl = environment.backendAPI;

    constructor(private _http: Http, public router: Router) {

    }
    /**
     * Following service for forgot the password and server will return response with provided email address is valid or not
     * More ever if email is valid then email will be delieverd to given email adresss 
     * @param email 
     *  e.g john.doe@site.com
     */
    forgotPassword(email): Observable<Login[]> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http
            .post(this.apiUrl + 'forgot-password', // TODO:low (take this code to cenertlized base service)
            { user_id: email })
            .map((res) => {
                let response = res.json();
                console.log(response);
                return response.email_sent;


            })
            .catch(this.handleError);
    }
    /**
     * This function will will verify the confirmation_token , whenever user clicks from email box , 
     * the control will come here via component and then token will be verified if corrects or not 
     * On Correct token User will be activated and directly logon to system
     * @param confirmationToken 
     *      e.g 50f669d489e9a3ca239737820473dda5ce80db2082e40873ba579452eade4fa2
     */
    verifyUser(confirmationToken: string): Observable<Object> {
        console.log(confirmationToken);
        return this._http
            .post(this.apiUrl + 'verification', // TODO:
            { confirmation_token: confirmationToken })
            .map((res) => {
                let response = res.json();
                //check user has been updated with activation and null confirmation key to avoid attacks user updation
                if (response.nModified == 1 && response.password_reset_token != '') {
                    return response;
                }
                else {
                    return null;
                }

            })
            .catch(this.handleError);
    }
    /**
     * 
     * @param password_reset_token 
     */
    verifyResetToken(password_reset_token: string): Observable<Object> {
        console.log(password_reset_token);
        return this._http
            .post(this.apiUrl + 'verify-reset-password', // TODO:
            { password_reset_token: password_reset_token })
            .map((res) => {
                let response = res.json();
                //check user has been updated with activation and null confirmation key to avoid attacks user updation
                if (response) {
                    return true;
                }
                else {
                    return false;
                }

            })
            .catch(this.handleError);
    }
    /**
     * 
     * @param model 
     *      ResetPassword
     */
    resetPassword(model: ResetPassword): Observable<Object> {

        return this._http
            .post(this.apiUrl + 'reset-password', // TODO:
            model)
            .map((res) => {
                let response = res.json();

                localStorage.setItem('auth_token', response.auth_token);
                localStorage.setItem('user_id', response.user_id);
                localStorage.setItem('perm', response.permissions);
                return true;


            })
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.log("From error handler" + error + " --");
        return Observable.throw({ 'body': error.json().message, 'status': error.status } || 'Server error');
    }
}
