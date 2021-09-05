import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';
import { ModuleApps } from './../';

@Injectable()
export class ModuleService extends BaseService {

    private _URL = "modules";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<ModuleApps[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <ModuleApps[]>response.json()).catch(this.handleError);
    }

    findByID(id: string, getPermissions: number): Observable<ModuleApps> {

        return this._get(`${this._URL}/view/${id}/${getPermissions}`).map((response: Response) => <ModuleApps>response.json()).catch(this.handleError);
    }

    getModules(): Observable<ModuleApps[]> {

        //TODO:low: Use enum instead of hadcoded 
        return this._get('module/index/0').map((response: Response) => <ModuleApps[]>response.json()).catch(this.handleError);
    }

    //TODO:low: delete this code
    // getModulesWithRoles(): Observable<ModuleApps[]> {
        
    //     //TODO:low: Use enum instead of hadcoded 
    //     return this._get(`module/index/1`).map((response: Response) => <ModuleApps[]>response.json()).catch(this.handleError);
    // }

}
