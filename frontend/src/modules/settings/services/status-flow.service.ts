import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';
import { StatusFlow } from './../';

@Injectable()
export class StatusFlowService extends BaseService {

    private _URL = "statusFlows";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<StatusFlow[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <StatusFlow[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        console.log(params);
        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

    }

    findByID(id: string): Observable<StatusFlow> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <StatusFlow>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    save(model: StatusFlow, existing_record: StatusFlow): Observable<StatusFlow> {
        if (existing_record) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }

    public create(model: StatusFlow): Observable<StatusFlow> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <StatusFlow>response.json()).catch(this.handleError);
    }

    public update(_id: string, model: StatusFlow): Observable<StatusFlow> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <StatusFlow>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

}
