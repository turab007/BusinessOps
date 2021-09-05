import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Applet } from './../';
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class AppletService extends BaseService {

    private _URL = 'applets';

    constructor(protected _http: Http) {
        super(_http);
    }

    /**
     * Find all
     */
    index(): Observable<Applet[]> {
        return this._get(`${this._URL}/index`).map((response: Response) => <Applet[]>response.json()).catch(this.handleError);
    }

    /**
     * Find one by id
     * @param id string
     */
    findByID(id: string): Observable<Applet> {
        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <Applet>response.json()).catch(this.handleError);
    }

    /**
     * Create/Insert new record
     * @param model Applet
     */
    create(model: Applet): Observable<Applet> {
        return this._post(`${this._URL}/create`, model).map((response: Response) => <Applet>response.json()).catch(this.handleError);
    }

    /**
     * Update existing record
     * @param _id string
     * @param model Applet
     */
    update(_id: string, model: Applet): Observable<Applet> {
        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <Applet>Object.assign({ _id: _id }, response.json());
            }).catch(this.handleError);
    }

    /**
     * Delete one record by id.
     * @param _id string
     */
    delete(_id: string): Observable<Object> {
        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


}

