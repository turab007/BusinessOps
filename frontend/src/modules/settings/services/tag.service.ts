import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';
import { Tag } from './../';

@Injectable()
export class TagService extends BaseService {

    private _URL = "tags";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<Tag[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <Tag[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        console.log(params);
        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

    }

    findByID(id: string): Observable<Tag> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <Tag>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    save(model: Tag, existing_record: Tag): Observable<Tag> {
        if (existing_record) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }

    private create(model: Tag): Observable<Tag> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <Tag>response.json()).catch(this.handleError);
    }

    private update(_id: string, model: Tag): Observable<Tag> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <Tag>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    getTypes(): Observable<Tag[]> {

        return this._get(`${this._URL}/types`).map((response: Response) => <Tag[]>response.json()).catch(this.handleError);
    }

}
