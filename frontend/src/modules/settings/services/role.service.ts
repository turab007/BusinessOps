import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';

import { Role, ModuleApps } from './../';

@Injectable()
export class RoleService extends BaseService {

    private _URL = "roles";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<Role[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <Role[]>response.json().roles).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        console.log(params);
        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

        // return this._get(`${this._URL}/index?page[pageSize]=${pageSize}&page[currentPage]=${currentPage}`)
        //     .map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    findByID(id: string, getPermissions: number): Observable<Role> {

        return this._get(`${this._URL}/view/${id}/${getPermissions}`).map((response: Response) => <Role>response.json()).catch(this.handleError);
    }

    save(model: Role): Observable<Role> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <Role>response.json()).catch(this.handleError);
    }

    update(_id: string, model: Role): Observable<Role> {

        return this._put(`${this._URL}/update/${_id}`, model).map((response: Response) => <Role>response.json()).catch(this.handleError);

    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    getModules(): Observable<ModuleApps[]> {

        return this._get(`${this._URL}/getModules`).map((response: Response) => <ModuleApps[]>response.json()).catch(this.handleError);
    }

}
