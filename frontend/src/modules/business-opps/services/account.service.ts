import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../shared/services/base.service';
import { Account, Technology, TimeZone } from './../';
import { BusinessGroup } from './../../settings/';

@Injectable()
export class AccountService extends BaseService {

    private _URL = "accounts";

    constructor(protected _http: Http) {
        super(_http);
    }

    index(): Observable<Account[]> {

        return this._get(`${this._URL}/index`).map((response: Response) => <Account[]>response.json()).catch(this.handleError);
    }

    index_paged(queryString): Observable<Object> {

        let params: URLSearchParams = this.jsonToQueryString(queryString);

        return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

    }

    findByID(id: string): Observable<Account> {

        return this._get(`${this._URL}/view/${id}`).map((response: Response) => <Account>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    save(model: Account, existing_record: Account): Observable<Account> {
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }

    private create(model: Account): Observable<Account> {

        return this._post(`${this._URL}/create`, model).map((response: Response) => <Account>response.json()).catch(this.handleError);
    }
    /**
     * an update call for account
     * @param _id 
     * @param model 
     */
    public update(_id: string, model: Account): Observable<Account> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <Account>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    delete(_id: string): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }
    /**
     * Get All technologies from server side
     */
    getTechnologies(): Observable<Technology[]> {

        return this._get(`${this._URL}/technologies`).map((response: Response) => <Technology[]>response.json()).catch(this.handleError);
    }
    /**
     * 
     * @param queryString 
     */
    getTimeZones(queryString: Object): Observable<TimeZone[]> {
        let params: URLSearchParams = this.jsonToQueryString(queryString);
        return this._get(`${this._URL}/timeZones?${params}`).map((response: Response) => <Technology[]>response.json()).catch(this.handleError);
    }
    /**
     * 
     */
    getBusinessGroupsByCurrentUser(): Observable<BusinessGroup[]> {
        return this._get(`${this._URL}/viewBusinessGroupsByCurrentUser`).map((response: Response) => <BusinessGroup[]>response.json()).catch(this.handleError);
    }
    /**
     * 
     * @param id 
     */
    findZoneByID(id: string): Observable<TimeZone> {

        return this._get(`${this._URL}/viewTimeZone/${id}`).map((response: Response) => <TimeZone>response.json()).catch(this.handleError);
    }
    /**
     * Getting accounts and status for kanban
     */
    getLeedsForKanBan(): Observable<Object> {

        return this._get(`${this._URL}/viewAccountsGroupGroupByStatus/`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

}
