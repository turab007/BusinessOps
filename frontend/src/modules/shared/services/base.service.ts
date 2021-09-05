
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { _ } from 'lodash-node';
import { environment } from '../../../environments/environment';
import { TokenService } from 'modules/layout/services/token.service';


@Injectable()
export class BaseService {

    protected apiUrl = environment.backendAPI;

    protected _http;
    // public _tokenService: TokenService;

    // private tokenService: TokenService

    constructor(_http: Http) {
        this._http = _http;


    }

    protected _InitHeaders(): Headers {

        let token = localStorage.getItem('auth_token');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', "Bearer " + token);

        return headers;
    }

    protected _get(url: string) {
        return this._http.get(`${this.apiUrl}${url}`, { headers: this._InitHeaders() });
    }

    protected _post(url: string, model: Object) {

        return this._http.post(`${this.apiUrl}${url}`, this.Jsonstringify(model), { headers: this._InitHeaders() });
    }

    protected _put(url: string, model: Object) {

        return this._http.put(`${this.apiUrl}${url}`, this.Jsonstringify(model), { headers: this._InitHeaders() });
    }
    protected _putBulk(url: string, data: Object) {
        console.log(JSON.stringify(data));
        return this._http.put(`${this.apiUrl}${url}`, JSON.stringify(data), { headers: this._InitHeaders() });
    }

    protected _delete(url: string) {

        return this._http.delete(`${this.apiUrl}${url}`, { headers: this._InitHeaders() });
    }

    protected handleError(error: Response) {

        console.log("From error handler" + error + " --");
        if (error.json().message == 'jwt expired' || error.json().message == 'jwt malformed' || error.json().message=="invalid signature" ) {
            console.log('yes');
            TokenService.instance1.setTokenMessage(true);
        }
        else
            {
                console.log('no');
            }
        return Observable.throw({ 'body': error.json().message, 'status': error.status } || 'Server error');
    }
    /**
     * Purpose of this method to do make sure that any boolean variable wont lose,
     * --we are experiencingget that any boolean variable with false value are not going to server
     * @param model 
     */
    private Jsonstringify(model) {
        model = _.object(_.map(model, (v, key) => {
            if (v == true || v == false) {
                v = v.toString();
            }
            return [key, v];
        }))

        return JSON.stringify(model)
    }

    /**
     * Convert Json to URLSearchParams query string
     * @param jsonObj Object
     */
    public jsonToQueryString(jsonObj: Object): URLSearchParams {

        let params = new URLSearchParams();

        for (let key1 in jsonObj) {

            if (typeof jsonObj[key1] == 'object') {

                for (let key2 in jsonObj[key1]) {
                    params.set(key1 + "[" + key2 + "]", jsonObj[key1][key2])
                }
            }
            else {
                params.set(key1, jsonObj[key1])
            }
        }
        return params;
    }
    /**
     * Download file
     * PCM: low (need to find some better way)
     * @param url 
    */
    downloadFile(url:string){
        window.location.href = `${this.apiUrl}${url}`
    }
}
