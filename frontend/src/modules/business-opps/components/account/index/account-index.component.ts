import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Account, AccountService } from 'modules/business-opps/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'account-index-page',
    templateUrl: 'account-index.component.html',
    styleUrls: ['account-index.component.css']
})
export class AccountIndexComponent implements OnInit {

    accounts: Account[];
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
            'url': "/business-opps/accounts/view"
        },
        {
            'title': "Update",
            'icon': "edit",
            'url': "/business-opps/accounts/update"
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
        private _accountService: AccountService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Account'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Account' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._accountService.index_paged(this.queryStrings).
            subscribe(
            response => {
                console.log(response);
                this.accounts = response['accounts'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
    }


    /**
     * Datatable dependency
     * delete record
     * @param obj
     *   will contains ({model: Account, pageSize: 10, currentPage: 1}) 
     */
    deleteRecord(obj: Object) {
        //delete process
        let model: Account = obj['model'];
        console.log(model);
        this._accountService.delete(model._id).subscribe((result) => {
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