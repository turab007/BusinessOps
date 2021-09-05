import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
//Because WorkSpace is parent
import { Task, TaskGroup, Comment, Attachment } from './../'
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';




@Injectable()
export class TaskService extends BaseService {
    private _URL = "tasks";

    constructor(protected _http: Http) {
        super(_http);
    }

    /*************************************************Classic methods **********************************************/
    index(_wsid:string,taskGroup: TaskGroup): Observable<Task[]> {

        return this._get(`${this._URL}/index/${_wsid}/${taskGroup._id}`).map((response: Response) => <TaskGroup[]>response.json()).catch(this.handleError);
    }

    index_paged(_wsid:string,queryString, taskGroup: TaskGroup): Observable<Object> {

        let params = this.jsonToQueryString(queryString);
        // console.log(params);
        return this._get(`${this._URL}/index/${_wsid}/${taskGroup._id}?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    }


    findByID(_wsid:string,id: string, taskGroup: TaskGroup): Observable<Task> {

        return this._get(`${this._URL}/view/${_wsid}/${taskGroup._id}/${id}`).map((response: Response) => <TaskGroup>response.json()).catch(this.handleError);
    }
    findByIDAndGroup(_wsid:string,id: string, groupId: string): Observable<Task> {
        return this._get(`${this._URL}/view/${_wsid}/${groupId}/${id}/`).map((response: Response) => <TaskGroup>response.json()).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param existing_record 
     */
    public save(_wsid:string,model: Task, existing_record: Task, taskGroup: TaskGroup): Observable<Task> {
       console.log("saving ",_wsid,model,existing_record,taskGroup)
       
        if (existing_record && existing_record['_id']) {
            return this.update(_wsid,existing_record['_id'], model, taskGroup);
        }
        else {
            return this.create(_wsid,model, taskGroup);
        }
    }
    /**
     * Create Task from Task Group
     * @param model 
     * @param Task Group 
     */
    public create(_wsid:string,model: Task, taskGroup: TaskGroup): Observable<Task> {

        return this._post(`${this._URL}/create/${_wsid}/${taskGroup._id}`, model).map((response: Response) => <TaskGroup>response.json()).catch(this.handleError);
    }
    /**
     * 
     * @param _id 
     *      TaskGroup item _id
     * @param model 
     *      TaskGroup Item data (posted)
     * @param taskGroup 
     *      parent TaskGroup
     */
    public update(_wsid:string,_id: string, model: Task, taskGroup: TaskGroup): Observable<Task> {

        return this._put(`${this._URL}/update/${_wsid}/${taskGroup._id}/${_id}`, model)
            .map((response: Response) => {
                return <TaskGroup>Object.assign({ _id: _id }, response.json())
            }).catch(this.handleError);
    }

    /**
     * Create Comment from Task
     * @param model 
     * @param Task  
    */
    public addComment(_wsid:string,model: Comment, task: Task): Observable<Task> {
        return this._post(`${this._URL}/addComment/${_wsid}/${task.task_group_id}/${task._id}`, model)
            .map((response: Response) => {
                <Task>response.json()
            }).catch(this.handleError);
    }
    /**
     * Update Comment from task
     * @param model 
     * @param comment 
     * @param task 
     */
    public updateComment(_wsid:string,comment: Comment, task: Task): Observable<Object> {
        return this._put(`${this._URL}/updateComment/${_wsid}/${task.task_group_id}/${task._id}/${comment._id}`, comment)
            .map((response: Response) => {
                <Object>response.json()
            }).catch(this.handleError);
    }

    /**
     * 
     * @param model 
     * @param comment 
     * @param task 
     */
    public removeComment(_wsid:string,comment: Comment, task: Task): Observable<Object> {
        return this._delete(`${this._URL}/removeComment/${_wsid}/${task.task_group_id}/${task._id}/${comment._id}`)
            .map((response: Response) => {
                <Object>response.json();
            }).catch(this.handleError);
    }


    public removeAttachment(_wsid:string,attach: Attachment, task: Task): Observable<Object> {
        return this._delete(`${this._URL}/removeAttachment/${_wsid}/${task.task_group_id}/${task._id}/${attach._id}`)
            .map((response: Response) => {
                <Object>response.json();
            }).catch(this.handleError);
    }

    public downloadAttachment(_wsid:string,attach: Attachment, task: Task): void {
        this.downloadFile(`${this._URL}/downloadAttachment/?tg=${task.task_group_id}&task=${task._id}&id=${attach._id}`);
    }

    /**
        * Update drag order of taskGroups
        * @param data 
        * @param ws 
    */
    public updateOrder(_wsid:string,data: Object, taskGroup: TaskGroup): Observable<any> {
        console.log(`${this._URL}/updateOrder/${_wsid}/${taskGroup._id}/`);
        return this._putBulk(`${this._URL}/updateOrder/${_wsid}/${taskGroup._id}/`, data)
            .map((response: Response) => {
                // console.log("---update")
                return response.json()
            }).catch(this.handleError);
    }

    delete(_wsid:string,_id: string, model: Task): Observable<Object> {

        return this._delete(`${this._URL}/delete/${_wsid}/${_id}/${model._id}`)
            .map((response: Response) => {
                <Object>response.json()
            }).catch(this.handleError);
    }


    taskStatus: any[] = ['new', 'in progress', 'ready for test', 'closed', 'needs info'];
    taskPriorities: any[] = ['low', 'medium', 'high'];


    getTaskStatus(): any[] {
        return this.taskStatus;
    }

    getTaskPriorities(): any[] {
        return this.taskPriorities;
    }


    addAttachment(_wsid:string,task: Task, formdata: FormData): Observable<Object> {
        let apiUrl = environment.backendAPI;

        let token = localStorage.getItem('auth_token');
        let headers = new Headers();
        headers.append('Authorization', "Bearer " + token);


        // console.log("This is inside task service");
        return this._http.post(`${this.apiUrl}${this._URL}/addAttachment/${_wsid}/${task.task_group_id}/${task._id}`, formdata, { headers: headers }).map((response: Response) => response.json()).catch(this.handleError)

        // return this._post(`${this._URL}/addAttachment/${task.task_group_id}/${task._id}`, formdata).map((response: Response) => {
        //     response.json()
        // }).catch(this.handleError)
        //     ;

    }

    findMyAssignedTasks(_wsid:string): Observable<Task[]> {
        return this._get(`${this._URL}/assigned/${_wsid}/`)
            .map((response: Response) => {

                return <Task[]>response.json()
            }).catch(this.handleError);
    }



}

