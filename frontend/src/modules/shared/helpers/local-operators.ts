import { Observable } from 'rxjs/Observable';

export function toJSON<T>(): Observable<Response> {
  return this.map(( response : Response ) => response.json());
}

declare module "rxjs/Observable" {
  interface Observable<T> {
    toJSON : typeof toJSON;
  }
}

Observable.prototype.toJSON = toJSON;