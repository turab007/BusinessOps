import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { BusinessGroup, BusinessGroupService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'business-group-index-page',
    templateUrl: 'business-group-index.component.html',
    styleUrls: ['business-group-index.component.css']
})
export class BusinessGroupIndexComponent implements OnInit {

    businessGroups: BusinessGroup[];
    //Datatable dependency
    dtColumns: any[] = [
        { name: 'name', label: 'Name', tooltip: 'Name', sortable: true, 'width': '30%' },
        { name: 'description', label: 'Description', sortable: true, 'width': '30%' },
        { name: 'status', label: 'Status', sortable: true, format: v => v == true ? "Active" : "In-Active", 'width': '30%' },

    ];

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/settings/business-groups/"
        },
        {
            'title': "Update",
            'icon': "update",
            'url': "/settings/business-groups/update"
        },
        {
            'action': 'delete',
            'title': "Delete",
            'icon': "delete",
            'url': ""
        }
    ]

    //related pagination and sorting
    totalRecords: number;
    queryStrings: Object = {};


    constructor(
        private _businessGroupService: BusinessGroupService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Business Group'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Business Groups' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._businessGroupService.index_paged(this.queryStrings).
            subscribe(
            response => {
                console.log(response);
                this.businessGroups = response['groups'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
    }


    /**
     * Datatable dependency
     * delete record
     * @param obj
     *   will contains ({model: BusinessGroup, pageSize: 10, currentPage: 1}) 
     */
    deleteRecord(obj: Object) {
        //delete process
        let model: BusinessGroup = obj['model'];
        this._businessGroupService.delete(model._id).subscribe((result) => {
            if (result) {
                this.queryStrings['page'] = obj['currentPage'];
                this._loadData();
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
        this._loadData();
    }

    filterRecords(model) {
        this.queryStrings['page'] = {
            pageSize: 10,
            currentPage: 1
        }
        this.queryStrings['filter'] = model;
        this._loadData();
    }
}