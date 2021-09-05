import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';
import { MailServer } from './../';

@Injectable()
export class MailServerService extends BaseService {

    private _URL = "mailServers";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<MailServer[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <MailServer[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        console.log(params);
        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

    }

    findByID(id: string): Observable<MailServer> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <MailServer>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    save(model: MailServer, existing_record: MailServer): Observable<MailServer> {
        if (existing_record) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }

    private create(model: MailServer): Observable<MailServer> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <MailServer>response.json()).catch(this.handleError);
    }

    private update(_id: string, model: MailServer): Observable<MailServer> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <MailServer>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }
    /**
     * Test mail 
     * @param _email 
     */
    testMail(_email: string): Observable<Object> {
        let data = {'email': _email} 
        return this._post(`${this._URL}/test`,data).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

}
