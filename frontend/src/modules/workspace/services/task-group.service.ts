import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
//Because WorkSpace is parent
import { TaskGroup, WorkSpace } from './../'
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class TaskGroupService extends BaseService {
    private _URL = "taskGroups";
    private workspaceData: TaskGroup[];

    constructor(protected _http: Http) {
        super(_http);
    }


    /*************************************************Classic methods **********************************************/
    index(ws: WorkSpace): Observable<TaskGroup[]> {

        return this._get(`${this._URL}/index/${ws._id}`).map((response: Response) => <TaskGroup[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString, ws: WorkSpace): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/index/${ws._id}?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


    findByID(id: string, ws: WorkSpace): Observable<TaskGroup> {

        return this._get(`${this._URL}/view/${ws._id}/${id}/`).map((response: Response) => <TaskGroup>response.json()).catch(this.handleError);
    }
    /**
     * 
     * @param id 
     * @param work_space 
     */
    findByPk(id: string, work_space: string): Observable<TaskGroup> {

        return this._get(`${this._URL}/view/${work_space}/${id}/`).map((response: Response) => <TaskGroup>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    public save(model: TaskGroup, existing_record: TaskGroup, ws: WorkSpace): Observable<TaskGroup> {
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model, ws);
        }
        else {
            return this.create(model, ws);
        }
    }
    /**
     * 
     * @param model 
     * @param ws 
     */
    private create(model: TaskGroup, ws: WorkSpace): Observable<TaskGroup> {

        return this._post(`${this._URL}/create/${ws._id}`, model).map((response: Response) => <TaskGroup>response.json()).catch(this.handleError);
    }
    /**
     * 
     * @param model 
     * @param ws 
     */
    public copy(model: TaskGroup, ws: WorkSpace): Observable<TaskGroup> {

        return this.create(model, ws);
    }

    /**
     * 
     * @param _id 
     * @param model 
     * @param ws 
     */
    public update(_id: string, model: TaskGroup, ws: WorkSpace): Observable<TaskGroup> {

        return this._put(`${this._URL}/update/${ws._id}/${_id}`, model)
            .map((response: Response) => {
                return <TaskGroup>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }
    /**
     * Update drag order of task groups
     * @param data 
     * @param ws 
     */
    public updateOrder(data: Object, ws: WorkSpace): Observable<TaskGroup> {
        console.log(`${this._URL}/updateOrder/${ws._id}/`);
        return this._putBulk(`${this._URL}/updateOrder/${ws._id}/`, data)
            .map((response: Response) => {
                console.log("---update")
                return response.json()
            }).catch(this.handleError);
    }
    /**
     * 
     * @param _id 
     * @param model 
     * @param ws 
     */
    public move(_id: string, model: TaskGroup, ws: WorkSpace): Observable<TaskGroup> {

        return this.update(_id, model, ws);
    }

    delete(_id: string, ws: WorkSpace): Observable<Object> {

        return this._delete(`${this._URL}/delete/${ws._id}/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


}

