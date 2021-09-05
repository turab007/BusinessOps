import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';
import { Contact, Technology } from './../';

@Injectable()
export class ContactService extends BaseService {

    private _URL = "contacts";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<Contact[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <Contact[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params: URLSearchParams = this.jsonToQueryString(queryString);

        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

    }

    findByID(id: string): Observable<Contact> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <Contact>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    save(model: Contact, existing_record: Contact): Observable<Contact> {
        if (existing_record) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }

    private create(model: Contact): Observable<Contact> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <Contact>response.json()).catch(this.handleError);
    }

    private update(_id: string, model: Contact): Observable<Contact> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <Contact>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


}
