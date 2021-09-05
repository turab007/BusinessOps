import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './../../../view-models/user';
import { UserService } from './../../../services/user.service';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'
import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'user-index-page',
  templateUrl: 'user-index.component.html',
  styleUrls: ['user-index.component.css']
})

export class UserIndexComponent implements OnInit {

  // Datatable dependency
  dtColumns: any[] = [
    { name: 'first_name', label: 'First Name', sortable: true, 'width': '30%' },
    { name: 'last_name', label: 'Last Name', sortable: true, 'width': '30%' },
    { name: 'user_id', label: 'Email', tooltip: 'Email', sortable: true, 'width': '30%' }
  ]
  // Datatable dependency
  actionButtons: any[] = [
    {
      'title': "View",
      'icon': "visibility",
      'url': "/settings/users/view"
    },
    {
      'title': "Update",
      'icon': "edit",
      'url': "/settings/users/update"
    },
    {
      'action': 'delete',
      'title': "Delete",
      'icon': "delete",
      'url': ""
    }
  ]

  totalRecords: number;

  queryStrings: Object = {};

  users: User[];

  constructor(
    private _userService: UserService,
    private router: Router,
    private menuService: LayoutService,
    private _loadingService: TdLoadingService
  ) {
    //TODO:Low (Take this to centeral place)
    menuArr['sub_module'] = 'Users'
    this.menuService.setMenu(menuArr);

  }

  ngOnInit(): void {

    this.menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { title: 'Users' },
    ])

    // TODO:low: page size should come from some configuration
    this.queryStrings['page'] = {
      pageSize: 10,
      currentPage: 1
    }
    this._getUsers();
  }

  private _getUsers(): void {

    this._loadingService.register('overlayStarSyntax');

    this._userService.index_paged(this.queryStrings).
      subscribe(
      Response => {

        this.users = Response["users"];
        this.totalRecords = Response["totalCount"];
        this._loadingService.resolve('overlayStarSyntax');

      },
      error => {
        this._loadingService.resolve('overlayStarSyntax');
        console.log(error);
      }) // end of subscribe
  }


  /**
   * Datatable dependency
   * delete record
   * @param model 
   */
  deleteRecord(page) {
    this._userService.delete(page.model._id).subscribe((result) => {

      if (result) {
        this.queryStrings['page'] = page;
        this._getUsers();
      }
    }, error => {
      // call back error
    })
  }

  /**
   * Load next page data
   * @param pageInfo object
   */
  nextPage(pageInfo) {
    this.queryStrings['page'] = pageInfo;
    this._getUsers();
  }

  filterRecords(model) {
    this.queryStrings['page'] = {
      pageSize: 10,
      currentPage: 1
    }
    this.queryStrings['filter'] = model;
    this._getUsers();
  }

}
