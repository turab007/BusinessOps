import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';

import { Permission } from './../';
import { ModulePermission } from './../';

@Injectable()
export class PermissionService extends BaseService {

    private _URL = "permissions";

    constructor(protected _http: Http) {
        super(_http);
    }

    findByModule(module_id: string): Observable<ModulePermission[]> {
        
        return this._get(`${this._URL}/findByModule/${module_id}`).map((response: Response) => <ModulePermission[]>response.json()).catch(this.handleError);
    }

    index(): Observable<Permission[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <Permission[]>response.json()).catch(this.handleError);
    }

    findByID(id: string): Observable<Permission> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <Permission>response.json()).catch(this.handleError);

    }

    save(model: Permission): Observable<Permission> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <Permission>response.json()).catch(this.handleError);
    }

    update(_id: string, model: Permission): Observable<Permission> {

        return this._put(`${this._URL}/update/${_id}`, model).map((response: Response) => <Permission>response.json()).catch(this.handleError);

    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

}
