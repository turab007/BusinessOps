import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Company, CompanyService } from 'modules/business-opps/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'company-index-page',
    templateUrl: 'company-index.component.html',
    styleUrls: ['company-index.component.css']
})
export class CompanyIndexComponent implements OnInit {

    companies: Company[];
    //Datatable dependency
    dtColumns: any[] = [
        { name: 'name', label: 'Name', tooltip: 'First Name', sortable: true },
        { name: 'email', label: 'Email', tooltip: 'Email', sortable: true },
        { name: 'address', label: 'Address', tooltip: 'Address', sortable: true },
    ];

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/business-opps/companies/view"
        },
        {
            'title': "Update",
            'icon': "edit",
            'url': "/business-opps/companies/update"
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
        private _companyService: CompanyService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Company'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Company' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._companyService.index_paged(this.queryStrings).
            subscribe(
            response => {
                console.log(response);
                this.companies = response['companies'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
    }


    /**
     * Datatable dependency
     * delete record
     * @param obj
     *   will contains ({model: Company, pageSize: 10, currentPage: 1}) 
     */
    deleteRecord(obj: Object) {
        //delete process
        console.log(obj);
        let model: Company = obj['model'];
        console.log(model);
        this._companyService.delete(model._id).subscribe((result) => {
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