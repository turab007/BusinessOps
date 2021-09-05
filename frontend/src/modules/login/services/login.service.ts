import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { EventEmitter, Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Login } from './../viewmodels/login.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoginService {

    apiUrl = environment.backendAPI;

    constructor(private _http: Http, public router: Router) {

    }

    //TODO:high: When user is signed out or key is expired, logout from frontend
    public isLoggedIn() {
        // return true;
        return (!!localStorage.getItem('auth_token'));
    }

    /**
     * User Login Method.
     * 
     * @param email string
     * @param password string
     */
    public logIn(email: string, password: string): Observable<Login[]> {

        // Set Headers
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // Send request to server.
        return this._http.post(this.apiUrl + 'login', JSON.stringify({ user_id: email, password: password }), { headers })
            .map((res) => {

                let response = res.json();

                console.log(response.permissions);

                localStorage.setItem('auth_token', response.auth_token);
                localStorage.setItem('user_id', response.user_id);
                localStorage.setItem('userID', response.userID);
                localStorage.setItem('perm', response.permissions);

                return true;

            }).catch(this.handleError);

    }

    public authenticateUser(email: string, password: string): Observable<any> {
        return this.logIn(email, password);
    }

    public logOut() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.clear();
        this.router.navigate(['auth/login']);
    }

    // TODO:low: delete this code.
    // public apiTest(): Observable<any> {
    //     // let headers = new Headers();
    //     // headers.append('Content-Type', 'application/json');
    //     return this._http
    //         .get(this.apiUrl + '/api/test')
    //         .map((res) => {
    //             let response = res.json();

    //             console.log(response.someKey);

    //             return true;
    //         })
    //         .catch(this.handleError);
    // }

    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().message || 'Server error');
    }
}
