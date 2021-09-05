import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Response, Headers } from '@angular/http';

import { Approval, Comment, Attachment } from './../'
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';



@Injectable()
export class ApprovalService extends BaseService {
    private _URL = "approvals";
    public approvalGroups: any[] = ['Pending', 'Approved', 'Rejected', 'Expired']; //LIST OF APPROVAL GROUPS

    constructor(protected _http: Http) {
        super(_http);
    }

    index(wsId: string): Observable<Approval[]> {

        return this._get(`${this._URL}/index/${wsId}`).map((response: Response) => {
            return <Approval[]>response.json()
        }).catch(this.handleError);
    }

    index_paged(queryString, wsId: string): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/index/${wsId}?${params}`).map((response: Response) => {
            return <Object>response.json()
        }).catch(this.handleError);
    }


    findByID(approval: Approval): Observable<Approval> {
        return this._get(`${this._URL}/view/${approval.work_space._id}/${approval._id}`)
            .map((response: Response) => {
                return <Approval>response.json();
            }).catch(this.handleError);
    }

    findByIDAndWorkSpace(id: string, wsID: string): Observable<Approval> {
        return this._get(`${this._URL}/view/${wsID}/${id}/`).map((response: Response) => <Approval>response.json()).catch(this.handleError);
    }


    /**
     * 
     * @param model 
     * @param existing_record 
     */
    public save(model: Approval, existing_record: Approval, wsId: string): Observable<Approval> {
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model, wsId);
        }
        else {
            return this.create(model, wsId);
        }
    }
    /**
     * Create approval from ws
     * @param model 
     * @param ws
     */
    public create(model: Approval, wsId: string): Observable<Approval> {


        return this._post(`${this._URL}/create/${wsId}`, model).map((response: Response) => {
            // console.log(response);

            return <Approval>response.json()
        }).catch(this.handleError);
    }
    /**
     * 
     * @param _id 
     * @param model 
     * @param ws 
     */
    public update(_id: string, model: Approval, wsId: string): Observable<Approval> {

        return this._put(`${this._URL}/update/${wsId}/${_id}`, model)
            .map((response: Response) => {
                return <Approval>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    /**
     * Create Comment from approval
     * @param model 
     * @param approval
    */
    public addComment(model: Comment, approval: Approval): Observable<Approval> {
        return this._post(`${this._URL}/addComment/${approval.work_space._id}/${approval._id}`, model)
            .map((response: Response) => {
                <Approval>response.json()
            }).catch(this.handleError);
    }
    /**
     * Update Comment from approval
     * @param model 
     * @param comment 
     * @param approval
     */
    public updateComment(comment: Comment, approval: Approval): Observable<Object> {
        return this._put(`${this._URL}/updateComment/${approval.work_space._id}/${approval._id}/${comment._id}`, comment)
            .map((response: Response) => {
                <Object>response.json()
            }).catch(this.handleError);
    }
    /**
     * 
     * @param model 
     * @param comment 
     * @param approval 
     */
    public removeComment(comment: Comment, approval: Approval): Observable<Object> {
        return this._delete(`${this._URL}/removeComment/${approval.work_space._id}/${approval._id}/${comment._id}`)
            .map((response: Response) => {
                <Object>response.json();
            }).catch(this.handleError);
    }

    public removeAttachment(_id: string, attach: Attachment, approval: Approval): Observable<Object> {
        return this._delete(`${this._URL}/removeAttachment/${_id}/${approval._id}/${attach._id}`)
            .map((response: Response) => {
                <Object>response.json();
            }).catch(this.handleError);
    }

    public downloadAttachment(_id: string, attach: Attachment, approval: Approval): void {
        this.downloadFile(`${this._URL}/downloadAttachment/?approval=${approval._id}&id=${attach._id}`);
    }



    /**
        * Update drag order of approvals
        * @param data 
        * @param ws 
    */
    public updateOrder(data: Object, wsId: string): Observable<any> {
        return this._putBulk(`${this._URL}/updateOrder/${wsId}/`, data)
            .map((response: Response) => {
                return response.json()
            }).catch(this.handleError);
    }

    delete(_id: string, model: Approval): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_id}/${model._id}`)
            .map((response: Response) => {
                <Object>response.json()
            }).catch(this.handleError);
    }


    addAttachment(_id: string, approval: Approval, formdata: FormData): Observable<Object> {
        let apiUrl = environment.backendAPI;

        let token = localStorage.getItem('auth_token');
        let headers = new Headers();
        headers.append('Authorization', "Bearer " + token);

        return this._http.post(`${this.apiUrl}${this._URL}/addAttachment/${_id}/${approval._id}`, formdata,
            {
                headers: headers
            }).map((response: Response) => {
                response.json()
            }).catch(this.handleError);

    }
    getApprovalGroups() {
        return this.approvalGroups;
    }

}