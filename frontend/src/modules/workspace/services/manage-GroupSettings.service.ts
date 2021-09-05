import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { Http, Response } from '@angular/http';
import { WorkSpace } from '../'

@Injectable()
export class ManageGroupSettingsService extends BaseService {

    constructor(protected _http: Http) {
        super(_http);
    }
    private _URL = "workSpaces";
    private ROLE_URL = "roles";
    
    // roles: string[] = ['List only', 'Read only', 'Editor', 'Creator', 'Super'];

    // getRoles(): Observable<string[]> {
    //     return Observable.of(this.roles);

    // }

    addUser(model, ws) {
        return this._put(`${this._URL}/addUser/${ws._id}`, model).map((response: Response) => {
            console.log('in service', response.json());

            return response.json();
            // console.log('this is reposnse ',<WorkSpace>response.json());
        }).catch(this.handleError)
    }


    removeUser(user, ws) {
        return this._delete(`${this._URL}/removeUser/${ws._id}/${user._id}`).map((response: Response) => {
            console.log('in delete service', response.json());

            return response.json();
            // console.log('this is reposnse ',<WorkSpace>response.json());
        }).catch(this.handleError)


    }

    getUsers(ws: WorkSpace) {
        return this._get(`${this._URL}/getUsers/${ws._id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    updateRole(user, ws, role) {
        let element = {
            user: user,
            ws: ws,
            role: role
        }
        // console.log('this is user', user);
        return this._put(`${this._URL}/updateRole/${ws._id}/${user._id}`, element).map((response: Response) => {
            console.log('in delete service', response.json());

            return response.json();
            // console.log('this is reposnse ',<WorkSpace>response.json());
        }).catch(this.handleError)

    }

    getRoles() {

        return this._get(`${this.ROLE_URL}/index/`).map((response: Response) => {
            console.log('user role', response.json());

            return response.json().roles;
            // console.log('this is reposnse ',<WorkSpace>response.json());
        }).catch(this.handleError)
    }


}