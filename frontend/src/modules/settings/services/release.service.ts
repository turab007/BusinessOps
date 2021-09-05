import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';

import { Release } from './../';

@Injectable()
export class ReleaseService extends BaseService {

    private _URL = "releases";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<Release[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <Release[]>response.json()).catch(this.handleError);
    }

    findByID(id: string): Observable<Release> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <Release>response.json()).catch(this.handleError);
    }

    save(model: Release): Observable<Release> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <Release>response.json()).catch(this.handleError);
    }

    update(_id: string, model: Release): Observable<Release> {

        return this._put(`${this._URL}/update/${_id}`, model).map((response: Response) => <Release>response.json()).catch(this.handleError);

    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }
}
