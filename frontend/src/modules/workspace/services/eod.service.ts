import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { EodReport } from './../'
import { BaseService } from '../../shared/services/base.service';


@Injectable()
export class EodService extends BaseService {
    private _URL = "eod";

    constructor(protected _http: Http) {
        super(_http);
    }


    /*************************************************Classic methods **********************************************/
    index(wsId: string): Observable<any> {

        return this._get(`${this._URL}/index/${wsId}`)
            .map((response: Response) => {
                return <any>response.json()
            }).catch(this.handleError);
    }

    index_paged(queryString, wsId: string): Observable<any> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/index/${wsId}?${params}`)
            .map((response: Response) => {
                return <any>response.json()
            }).catch(this.handleError);
    }

    search(queryString, wsId: string): Observable<any> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/search/${wsId}?${params}`)
            .map((response: Response) => {
                return <any>response.json()
            }).catch(this.handleError);
    }


    findByID(id: string, wsId: string): Observable<EodReport> {

        return this._get(`${this._URL}/view/${wsId}/${id}/`)
            .map((response: Response) => {
                return <EodReport>response.json();
            }).catch(this.handleError);
    }


    /**
     * 
     * @param model 
     * @param existing_record 
     */
    public save(model: EodReport, existing_record: EodReport, wsId: string): Observable<EodReport> {
        console.log("this is inside eod service ", model);
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model, wsId);
        }
        else {
            return this.create(model, wsId);
        }
    }
    /**
     * 
     * @param model 
     * @param ws 
     */
    private create(model: EodReport, wsId: string): Observable<EodReport> {

        return this._post(`${this._URL}/create/${wsId}`, model)
            .map((response: Response) => {
                return <EodReport>response.json()
            }).catch(this.handleError);
    }
    /**
     * 
     * @param model 
     * @param ws 
     */
    public copy(model: EodReport, wsId: string): Observable<EodReport> {

        return this.create(model, wsId);
    }

    /**
     * 
     * @param _id 
     * @param model 
     * @param ws 
     */
    public update(_id: string, model: EodReport, wsId: string): Observable<EodReport> {

        return this._put(`${this._URL}/update/${wsId}/${_id}`, model)
            .map((response: Response) => {
                return <EodReport>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    /**
     * 
     * @param _id 
     * @param model 
     * @param ws 
     */
    public move(_id: string, model: EodReport, wsId: string): Observable<EodReport> {
        return this.update(_id, model, wsId);
    }

    delete(_id: string, wsId: string): Observable<Object> {
        return this._delete(`${this._URL}/delete/${wsId}/${_id}`)
            .map((response: Response) => {
                return <Object>response.json()
            }).catch(this.handleError);
    }
}