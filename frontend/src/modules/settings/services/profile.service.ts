
import { Injectable } from "@angular/core"
import { Headers, Http, Response } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs/Observable'

import { User, Profile, ChangePassword } from './../';
import { WorkSpace } from './../../workspace/';

import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class ProfileService extends BaseService {
  private _URL = "profile";


  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(protected http: Http) {
    super(http);

  }

  /**
   * 
   * @param model 
   */
  public changePassword(model: ChangePassword): Observable<User> {
    return this._post(`${this._URL}/change-password`, model)
      .map((response: Response) => {
        return response.json()
      }).catch(this.handleError);
  }
  public save(model: Profile): Observable<Object> {
    return this._post(`${this._URL}/update`, model)
      .map((response: Response) => {
        console.log(response.json());
        return response.json()
      }).catch(this.handleError);
  }

  /**
   * 
   */
  public getProfile(): Observable<User> {
    return this._get(`${this._URL}/view`).map((response: Response) => <User>response.json()).catch(this.handleError);
  }
  /**
   * Get current user work spaces
   */
  public getWorkSpaces(): Observable<WorkSpace[]> {
    return this._get(`${this._URL}/currentWorkSpaces`).map((response: Response) => <WorkSpace[]>response.json()).catch(this.handleError);
  }

  public getAppletCount() {
    return this._get(`${this._URL}/getAppletCount`).map((response: Response) => <any[]>response.json()).catch(this.handleError);
   
  }


}