import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Lead, LeadService } from 'modules/business-opps/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'lead-index-page',
    templateUrl: 'lead-index.component.html',
    styleUrls: ['lead-index.component.css']
})
export class LeadIndexComponent implements OnInit {

    leads: Lead[];
    //Datatable dependency
    dtColumns: any[] = [
        { name: 'name', label: 'Name', tooltip: 'Name', sortable: true, 'width': '30%' },
        { name: 'contact_id', label: 'Contact', sortable: true,format: v => v ? v.name : "" },
        { name: 'company_id', label: 'Company', sortable: true,format: v => v ? v.name : "" },
        { name: 'is_active', label: 'Active', sortable: true, format: v => v == true ? "Yes" : "No", 'width': '30%' },

    ];

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/business-opps/leads/detail-actions"
        },
        {
            'title': "Update",
            'icon': "edit",
            'url': "/business-opps/leads/update"
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
        private _leadService: LeadService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Lead'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Lead' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._leadService.index_paged(this.queryStrings).
            subscribe(
            response => {
                console.log(response);
                this.leads = response['leads'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
    }


    /**
     * Datatable dependency
     * delete record
     * @param obj
     *   will contains ({model: Lead, pageSize: 10, currentPage: 1}) 
     */
    deleteRecord(obj: Object) {
        //delete process
        let model: Lead = obj['model'];
        console.log(model);
        this._leadService.delete(model._id).subscribe((result) => {
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