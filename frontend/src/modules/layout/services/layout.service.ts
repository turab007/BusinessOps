import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { _ } from "lodash-node";
@Injectable()
export class LayoutService {

  // Observable string sources
  private menuSubject = new Subject<string>();

  private breadCrumbSource = new Subject<any[]>();

  // Observable string streams

  menu$ = this.menuSubject.asObservable();

  breadCrumb$ = this.breadCrumbSource.asObservable();

  setBreadCrumb(breadcrumbs: any) {
    this.breadCrumbSource.next(breadcrumbs);
  }
  /**
   * 
   * @param menu 
   * @param key 
   *    eg :id
   * @param value 
   *     eg 596cb8009b32417d2aabc71c
   *  if key like :id found in menu then menu.links id will replaced with value for actual prameter
   *  Suppose menu url is like that = /workspace/:id after actual value it will be like that
   *  ------- /workspace/596cb8009b32417d2aabc71c
   */
  setMenu(menu: any, key?: string, value?: string) {
    if (key && value) {
      menu.applet_links = _.map(menu.applet_links, (link) => {
        if (link.applet) {
          let route = this.omitEmptyData(link.route.split("/"));
          route[1] = value;
          link.route = `/${route.join("/")}`;
          // console.log(link.route);
        }
        else if (link.route.search("workspace") != -1) {
          let route = this.omitEmptyData(link.route.split("/"));
          route[1] = value;
          link.route = `/${route.join("/")}`;
        }
        return link;
      })
      menu.links = _.map(menu.links, (link) => {
        if (link.route.search("workspace") != -1) {
          let route = this.omitEmptyData(link.route.split("/"));
          route[1] = value;
          link.route = `/${route.join("/")}`;
        }
        return link;
      })
      menu.settings_links = _.map(menu.settings_links, (link) => {
        if (link.route.search("workspace") != -1) {
          let route = this.omitEmptyData(link.route.split("/"));
          route[1] = value;
          link.route = `/${route.join("/")}`;
        }
        return link;
      })
    }
    // console.log(menu);

    this.menuSubject.next(menu);
  }

  clearMenu() {
    this.menuSubject.next();
  }
  /**
   * Remove element
   * @param item 
   */
  private omitEmptyData(item: any) {
    //|| _.isNull(v)
    return _.filter(item, function (v) { if (v) { return v } });
  }

  //TODO:low: delete this method
  // getMenu(): Observable<any> {
  //   return this.menuSubject.asObservable();
  // }

}