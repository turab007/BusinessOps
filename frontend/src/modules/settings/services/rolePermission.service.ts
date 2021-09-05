import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';

import { RolePermission, ModuleApps, Permission } from './../';


@Injectable()
export class RolePermissionService extends BaseService {

    constructor(protected _http: Http) {
        super(_http);
    }

    private _URL = "rolewspermissions";


    index(): Observable<RolePermission[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <RolePermission[]>response.json().roles).catch(this.handleError);
    }

    getRolePermissions(role,_wsId): Observable<Permission[]> {
        return this._get(`${this._URL}/getPermissions/${_wsId}/${role}`).map((response: Response) => <Permission[]>response.json()).catch(this.handleError);
    }

    delete(model,_wsId): Observable<Object> {

        return this._put(`${this._URL}/removePermission/${_wsId}`, model).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    save(model,_wsId): Observable<RolePermission> {

        return this._post(`${this._URL}/create/${_wsId}`, model).map((response: Response) => <RolePermission>response.json()).catch(this.handleError);
    }

    // getUnassignedPermissions(permissions) {

    //     return this._put(`${this._URL}/getUnassignedPermissions`, permissions).map((response: Response) => <Object>response.json()).catch(this.handleError);


    // }


}