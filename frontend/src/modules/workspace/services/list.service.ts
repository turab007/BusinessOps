import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
//Because WorkSpace is parent
import { List, WorkSpace } from './../'
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class ListService extends BaseService {
    private _URL = "lists";
    private workspaceData: List[];

    constructor(protected _http: Http) {
        super(_http);
    }


    /*************************************************Classic methods **********************************************/

    /**
     * GET ALL LISTS
     */
    index(ws: WorkSpace): Observable<List[]> {

        return this._get(`${this._URL}/index/${ws._id}`).map((response: Response) => <List[]>response.json()).catch(this.handleError);
    }

    /**
     * GET PAGE OF LIST
     * @param queryString PAGE INFORMATION 
     * @param ws CURRENT WORKSPACE
     */
    index_paged(queryString, ws: WorkSpace): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/index/${ws._id}?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    /**
     * FIND LIST BY ID
     * @param id ID OF LIST
     * @param ws CURRENT WORKSPACE
     */
    findByID(id: string, ws: WorkSpace): Observable<List> {

        return this._get(`${this._URL}/view/${id}/${ws._id}`).map((response: Response) => <List>response.json()).catch(this.handleError);
    }

    /**
     * EDIT OR CREATE NEW LIST
     * @param model LIST TO ADD
     * @param existing_record LIST ELEMENT IF IT IS EDITIED
     */
    public save(model: List, existing_record: List, ws: WorkSpace): Observable<List> {
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model, ws);
        }
        else {
            return this.create(model, ws);
        }
    }
    /**
     * CREATE NEW LIST
     * @param model LIST TO ADD
     * @param ws CURRENT WORKSPACE
     */
    private create(model: List, ws: WorkSpace): Observable<List> {

        return this._post(`${this._URL}/create/${ws._id}`, model).map((response: Response) => <List>response.json()).catch(this.handleError);
    }
    /**
     * COPY LIST
     * @param model LIST TO COPY
     * @param ws WORKSPACE TO COPY IN
     */
    public copy(_id: string, model: List, ws: WorkSpace): Observable<List> {

        return this._post(`${this._URL}/copy/${ws._id}/${_id}`, model).map((response: Response) => <List>response.json()).catch(this.handleError);
    }


    /**
     * MOVE LIST TO ANOTHER WORKSPACE
     * @param _id ID OF LIST
     * @param model LIST ELEMENT
     * @param ws WORKSPACE TO MOVE TO  
    */
    public move(_id: string, model: List, ws: WorkSpace): Observable<List> {

        return this._put(`${this._URL}/move/${ws._id}/${_id}`, model)
            .map((response: Response) => {
                return <List>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    /**
     * SHARE LIST
     * @param model LIST TO SHARE 
     * @param ws WORKSPACE ID OF LIST
    */
    public share(_id: string, model: List, ws: WorkSpace): Observable<List> {

        return this._post(`${this._URL}/share/${ws._id}/${_id}`, model).map((response: Response) => <List>response.json()).catch(this.handleError);
    }


    /**
     * UPDATE LIST
     * @param _id ID OF LIST
     * @param model LIST ELEMENT
     * @param ws WORKSPACE OF LIST
     */
    public update(_id: string, model: List, ws: WorkSpace): Observable<List> {

        return this._put(`${this._URL}/update/${ws._id}/${_id}`, model)
            .map((response: Response) => {
                return <List>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    /**
     * Update drag order of lists
     * @param data 
     * @param ws 
     */
    public updateOrder(data: Object, ws: WorkSpace): Observable<List> {
        console.log(`${this._URL}/updateOrder/${ws._id}/`);
        return this._putBulk(`${this._URL}/updateOrder/${ws._id}/`, data)
            .map((response: Response) => {
                console.log("---update")
                return response.json()
            }).catch(this.handleError);
    }

    /**
     * DELETE A LIST
     * @param _id ID OF LIST
     * @param ws WORKSPACE OF LIST
     */
    delete(_id: string, ws: WorkSpace): Observable<Object> {

        return this._delete(`${this._URL}/delete/${ws._id}/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    /**
 * 
 * @param id 
 * @param work_space 
 */
    findByPk(id: string, work_space: string): Observable<List> {

        return this._get(`${this._URL}/view/${work_space}/${id}/`).map((response: Response) => <List>response.json()).catch(this.handleError);
    }

}

