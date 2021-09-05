import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

import { Role } from './../../../../view-models/role';
import { RoleService } from './../../../../services/role.service';

@Component({
    selector: 'role-page',
    templateUrl: 'role-index.component.html',
    styleUrls: ['role-index.component.css']
})
export class RoleIndexComponent implements OnInit {

    // Datatable dependency
    totalRecords: number;

    dtColumns: any[] = [
        { name: 'name', label: 'Role', tooltip: 'Role Group', 'width': '30%' },
        { name: 'module_id', label: 'Module', tooltip: 'Module/App', 'width': '30%' },
        { name: 'description', label: 'Description' }
    ]

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/settings/roles/view"
        },
        {
            'title': "Update",
            'icon': "edit",
            'url': "/settings/roles/update"
        },
        {
            'action': 'delete',
            'title': "Delete",
            'icon': "delete",
            'url': ""
        }
    ]


    roles: Role[];

    queryStrings: Object = {};

    constructor(
        private _roleService: RoleService,
        private router: Router,
        private menuService: LayoutService) {
        //ToDO:low take this to central place
        menuArr['sub_module'] = 'Roles'
        this.menuService.setMenu(menuArr);
    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Roles' },
        ])

        this.queryStrings['page'] = {
            pageSize: 10,
            currentPage: 1
        }

        this._getRoles();
    }

    private _getRoles() {

        this._roleService.index_paged(this.queryStrings).subscribe(
            Response => {
                this.roles = Response["roles"];
                this.totalRecords = Response["totalCount"];

            },
            error => console.log(error)
        ) // end of subscribe
    }

    /**
     * Datatable dependency
     * 
     * @param model 
     */
    deleteRecord(page) {

        this._roleService.delete(page.model._id).subscribe((result) => {
            if (result) {
                this.queryStrings['page'] = page;
                this._getRoles();
            }
        }, error => {

        })
    }

    /**
   * Load next page data
   * @param pageInfo object
   */
    nextPage(pageInfo) {
        this.queryStrings['page'] = pageInfo;
        this._getRoles();
    }

    filterRecords(model) {
        this.queryStrings['filter'] = model;
        this._getRoles();
    }

}