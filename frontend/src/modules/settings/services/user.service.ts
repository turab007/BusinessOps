
import { Injectable } from "@angular/core"
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs/Observable'

import { User } from './../view-models/user';
import { ChangePassword } from './../view-models/change-password';

import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class UserService extends BaseService {
  private _URL = "users";


  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(protected http: Http) {
    super(http);

  }

  /**
   * 
   * @param user 
   * @param id 
   */
  save(model: User, existing_record: User): Observable<User> {
    if (existing_record) {
      return this.update(model, existing_record['_id']);
    }
    else {
      return this.create(model);
    }
  }

  /**
   * Create function for User Module
   * @param model 
   */
  private create(model: User): Observable<User> {
    return this._post(`${this._URL}/create`, model).map((response: Response) => <User>response.json()).catch(this.handleError);
  }

  private update(model: User, _id: string): Observable<User> {

    return this._put(`${this._URL}/update/${_id}`, model)
      .map((response: Response) => {
        return <User>Object.assign({ _id: _id }, response.json())
      }).catch(this.handleError);
  }

  /**
   * 
   * @param id 
   */
  public delete(_id: string): Observable<Object> {
    return this._delete(`${this._URL}/delete/${_id}`).map((response: Response) => <Object>response.json()).catch(this.handleError);
  }


  getList(): Observable<User[]> {
    return this._get(`${this._URL}/index`).map((response: Response) => <User[]>response.json()).catch(this.handleError);
  }

  // index_paged(pageSize: number, currentPage: number): Observable<Object> {
  index_paged(queryString): Observable<Object> {

    let params: URLSearchParams = this.jsonToQueryString(queryString);

    return this._get(`${this._URL}/index?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

  }
  /**
   * Get Record
   * @param id 
   */
  get(id: string): Observable<User> {
    return this._get(`${this._URL}/view/${id}`).map((response: Response) => <User>response.json()).catch(this.handleError);
  }

  /**
 * Get Record
 * @param id 
 */
  getLoggedInUser(): Observable<User> {
    return this._get(`${this._URL}/logged`).map((response: Response) => {
      return <User>response.json();
    }).catch(this.handleError);
  }

  /**
   * 
   * @param email 
   */
  public getByEmail(email: string, id: string): Observable<User> {
    return this._get(`${this._URL}/viewBy/user_id/${email}/${id}`).map((response: Response) => <User>response.json()).catch(this.handleError);
  }

  public getUrl(url: string): Observable<User> {
    return this._get(`${url}`).map((response: Response) => <User>response.json()).catch(this.handleError);
  }
  /**
   * AutoComplete
   * @param queryString 
   */
  public getAutoComplete(queryString): Observable<Object> {
    let params: URLSearchParams = this.jsonToQueryString(queryString);
    return this._get(`${this._URL}/auto-complete?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

  }
  /**
   * 
   * @param queryString 
   */
  public getSelected(queryString): Observable<Object> {
    let params: URLSearchParams = this.jsonToQueryString(queryString);
    return this._get(`${this._URL}/selected?${params}`).map((response: Response) => <Object>response.json()).catch(this.handleError);

  }

  public getUsers(): Observable<Object> {
    return this._get(`${this._URL}/getusers`).map((response: Response) => <Object>response.json()).catch(this.handleError);
    //  console.log('this is abc',abc);
    //     return abc; 
  }

/**
 * AUTHENTICATE GITHUB WITH USER
 * @param model 
 */
  public authenticateGitHub(model): Observable<Object> {
    return this._post(`${this._URL}/authenticategithub`, model).map((response: Response) => <Object>response.json()).catch(this.handleError);
  }

  /**
 * AUTHENTICATE GITLAB WITH USER
 * @param model 
 */
  public authenticateGitLab(model): Observable<Object> {
    return this._post(`${this._URL}/authenticategitlab`, model).map((response: Response) => <Object>response.json()).catch(this.handleError);
  }

}