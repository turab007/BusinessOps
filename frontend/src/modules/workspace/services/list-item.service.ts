import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
//Because WorkSpace is parent
import { ListItem, List } from './../'
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class ListItemService extends BaseService {
    private _URL = "listItems";
    private workspaceData: List[];

    constructor(protected _http: Http) {
        super(_http);
    }


    /*************************************************Classic methods **********************************************/
    index(_wsid:string,list: List): Observable<List[]> {

        return this._get(`${this._URL}/index/${_wsid}/${list._id}`).map((response: Response) => <List[]>response.json()).catch(this.handleError);
    }

    index_paged(_wsid:string,queryString, list: List): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/index/${_wsid}/${list._id}?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


    findByID(_wsid:string,id: string, list: List): Observable<List> {

        return this._get(`${this._URL}/view/${_wsid}/${list._id}/${id}`).map((response: Response) => <List>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    public save(_wsid:string,model: ListItem, existing_record: ListItem, list: List): Observable<List> {
        if (existing_record && existing_record['_id']) {
            return this.update(_wsid,existing_record['_id'], model, list);
        }
        else {
            return this.create(_wsid,model, list);
        }
    }
    /**
     * Create ListItem from list
     * @param model 
     * @param list 
     */
    public create(_wsid:string,model: ListItem, list: List): Observable<List> {

        return this._post(`${this._URL}/create/${_wsid}/${list._id}`, model).map((response: Response) => <List>response.json()).catch(this.handleError);
    }
    /**
     * 
     * @param _id 
     *      List item _id
     * @param model 
     *      List Item data (posted)
     * @param list 
     *      parent List
     */
    public update(_wsid:string,_id: string, model: ListItem, list: List): Observable<List> {

        return this._put(`${this._URL}/update/${_wsid}/${list._id}/${_id}`, model)
            .map((response: Response) => {
                return <List>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    /**
        * Update drag order of lists
        * @param data 
        * @param ws 
    */
    public updateOrder(_wsid:string,data: Object, list: List): Observable<List> {
        console.log(`${this._URL}/updateOrder/${list._id}/`);
        return this._putBulk(`${this._URL}/updateOrder/${_wsid}/${list._id}/`, data)
            .map((response: Response) => {
                console.log("---update")
                return response.json()
            }).catch(this.handleError);
    }

    delete(_wsid:string,_id: string, model: ListItem): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_wsid}/${_id}/${model._id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


}

