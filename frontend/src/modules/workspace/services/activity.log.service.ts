import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

import { ActivityLog } from './../'
import { BaseService } from '../../shared/services/base.service';
import { Subject } from "rxjs";


@Injectable()
export class ActivityLogService extends BaseService {

    private _URL = 'activity';
    private logUpdate = new Subject<boolean>();
    public getUpdatedLog$: any;

    constructor(protected _http: Http) {
        super(_http);
        this.getUpdatedLog$ = this.logUpdate.asObservable();
    }

    /**
     * Find all
     */
    index(): Observable<ActivityLog[]> {
        return this._get(`${this._URL}/index`).map((response: Response) => {

            <ActivityLog[]>response.json();

        }).catch(this.handleError);
    }

    getLogForTask(_wsId:string,t_id: string): Observable<ActivityLog[]> {
        return this._get(`${this._URL}/task/${_wsId}/${t_id}`)
            .map((response: Response) => {

                return <ActivityLog[]>response.json()

            }).catch(this.handleError);

    }

    getLogForApproval(_wsId:string,a_id: string): Observable<ActivityLog[]> {
        return this._get(`${this._URL}/approval/${_wsId}/${a_id}`)
            .map((response: Response) => {

                return <ActivityLog[]>response.json()

            }).catch(this.handleError);

    }

    fetchLog() {
        this.logUpdate.next(true);
    }

}