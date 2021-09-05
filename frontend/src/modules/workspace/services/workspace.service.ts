import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { WorkSpace, Applet } from './../'
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class WorkspaceService extends BaseService {
    private _URL = "workSpaces";
    private _ROLEURL = "roles";

    private workspaceData: WorkSpace[];
    private listArray: any[] = [];

    createList(listName: string): Observable<void> {
        this.listArray.push({ name: listName, elements: [], newElement: "" });
        return;
    }

    constructor(protected _http: Http) {
        super(_http);

    }


    /*************************************************Classic methods **********************************************/
    index(): Observable<WorkSpace[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <WorkSpace[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        console.log(params);
        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }
    /**
     * Get those workspace where type is not personal
     * @param queryString 
     */
    index_not_personal_paged(queryString): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        console.log(params);
        return this._get(`${this._URL}/getNotPersonal?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    index_not_personal(): Observable<WorkSpace> {
        return this._get(`${this._URL}/getNotPersonal`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    findByID(id: string): Observable<WorkSpace> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => {
            return <WorkSpace>response.json();
        }).catch(this.handleError)

    }

    /**
     * GET ROLE OF USER
     * @param ws WORKSPACE
     */

    getUserRoles(ws: WorkSpace): Observable<Object> {

        localStorage.setItem('wsID', ws._id);
        let userID = localStorage.userID;
        let role;
        // console.log("userrole", ws.user_role);
        ws.user_role.forEach(userRole => {
            if (userID == userRole._id._id) {
                // console.log('this is equal', userRole);
                role = userRole.role.toString();
            }

        });
        return this._get(`${this._ROLEURL}/view/${role}`).map((response: Response) => {
            return response.json();
        }).catch(this.handleError)
    }

    getUserPermissions(role) {

        return this._get(`rolepermissions/getPermissions/${role}`).map((response: Response) => {
            return response.json();
        }).catch(this.handleError)

    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    public save(model: WorkSpace, existing_record: WorkSpace): Observable<WorkSpace> {
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }
    /**
     * Add WorkSpace in User (many to many )
     * @param model 
     */
    public add(model: WorkSpace): Observable<WorkSpace> {
        return this._put(`${this._URL}/addWorkSpace/${model._id}`, model).map((response: Response) => <WorkSpace>response.json()).catch(this.handleError);
    }
    /**
    * Add applet to workspace
    * @param model 
    *      Applet 
    * @param ws 
    *      WorkSpace
    */
    public addApplet(model: Applet, ws: WorkSpace): Observable<WorkSpace> {
        return this._put(`${this._URL}/addApplet/${ws._id}/${model._id}`, model).map((response: Response) => <WorkSpace>response.json()).catch(this.handleError);
    }
    /**
    * Remove applet from workspace
    * @param model 
    *      Applet 
    * @param ws 
    *      WorkSpace
    */
    public removeApplet(model: Applet, ws: WorkSpace): Observable<WorkSpace> {
        return this._delete(`${this._URL}/removeApplet/${ws._id}/${model._id}`).map((response: Response) => <WorkSpace>response.json()).catch(this.handleError);
    }

    private create(model: WorkSpace): Observable<WorkSpace> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <WorkSpace>response.json()).catch(this.handleError);
    }

    private update(_id: string, model: WorkSpace): Observable<WorkSpace> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <WorkSpace>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


}

