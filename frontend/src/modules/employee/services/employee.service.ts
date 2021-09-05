import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Employee } from '../';

import { BaseService } from '../../shared/services/base.service';
import { Subject } from "rxjs";


@Injectable()
export class EmployeeService extends BaseService {

    constructor(protected _http: Http) {
        super(_http);
    }

    public static currentEmployee: Employee;
    private _URL = 'employee';


    /**
     * GET ALL EMPLOYEES
     */
    index(): Observable<any> {
        return this._get(`${this._URL}/index`)
            .map((response: Response) => {
                return <any>response.json()
            }).catch(this.handleError)
    }

    /**
     * GET EMPLOYEE BY ITS ID
     */
    findByID(_id: string): Observable<Employee> {

        return this._get(`${this._URL}/view/${_id}`).map((response: Response) => <Employee>response.json()).catch(this.handleError);
    }

    /**
     * GET GITHUB REPOS OF EMPLOYEES
     * @param _id 
     */
    getGitHubRepos(_id: string): Observable<Object> {

        return this._get(`${this._URL}/getgithubrepos/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    /**
     * GET GITLAB REPOS OF EMPLOYEE
     * @param _id 
     */

    getGitLabRepos(_id: string): Observable<Object> {

        return this._get(`${this._URL}/getgitlabrepos/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


    /**
 * EDIT OR CREATE NEW EMPLOYEE
 * @param model EMPLOYEE TO ADD
 * @param existing_record EMPLOYEE ELEMENT IF IT IS EDITIED
 */
    public save(model: Employee, existing_record?: Employee): Observable<Employee> {
        if (existing_record && existing_record['_id']) {
            return this.update(existing_record['_id'], model);
        }
        else {
            return this.create(model);
        }
    }
    /**
     * CREATE NEW LIST
     * @param model LIST TO ADD
     * @param ws CURRENT WORKSPACE
     */
    private create(model: Employee): Observable<Employee> {

        return this._post(`${this._URL}/create/`, model).map((response: Response) => <Employee>response.json()).catch(this.handleError);
    }


    /**
     * UPDATE EMPLOYEE
     * @param _id ID OF EMPLOYEE
     * @param model EMPLOYEE ELEMENT
     * @param ws WORKSPACE OF EMPLOYEE
     */
    private update(_id: string, model: Employee): Observable<Employee> {

        return this._put(`${this._URL}/update/${_id}`, model)
            .map((response: Response) => {
                return <Employee>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }



    getGitlabRepoCommits(_empId: string, _repoId: string, _branch: string, _since: string, _until: string): Observable<Object> {

        return this._get(`${this._URL}/getgitlabcommits/${_empId}/${_repoId}/${_branch}/${_since}/${_until}/`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    getGitlabRepoBranches(_empId: string, _repoId: string): Observable<Object> {
        return this._get(`${this._URL}/getgitlabbranches/${_empId}/${_repoId}/`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    getGithubRepoBranches(_empId: string, _owner: string, _repo: string): Observable<Object> {
        return this._get(`${this._URL}/getgithubbranches/${_empId}/${_owner}/${_repo}/`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }

    getGithubRepoCommits(_empId: string, _owner: string, _branch: string, _repo: string, _until: string, _since: string): Observable<Object> {

        return this._get(`${this._URL}/getgithubcommits/${_empId}/${_owner}/${_repo}/${_branch}/${_since}/${_until}/`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }
}