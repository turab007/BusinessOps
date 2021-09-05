import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Contact, ContactService } from 'modules/business-opps/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'contact-index-page',
    templateUrl: 'contact-index.component.html',
    styleUrls: ['contact-index.component.css']
})
export class ContactIndexComponent implements OnInit {

    contacts: Contact[];
    //Datatable dependency
    dtColumns: any[] = [
        { name: 'first_name', label: 'First Name', tooltip: 'First Name', sortable: true },
        { name: 'last_name', label: 'Last Name', tooltip: 'Last Name', sortable: true },
        { name: 'account', label: 'Account', tooltip: 'Account', sortable: true },
        { name: 'company', label: 'Company', tooltip: 'Company', sortable: true, format: v => v ? v.name : "" },
        { name: 'email', label: 'Email', tooltip: 'Email', sortable: true },
    ];

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/business-opps/contacts/view"
        },
        {
            'title': "Update",
            'icon': "edit",
            'url': "/business-opps/contacts/update"
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
        private _contactService: ContactService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Contact'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Contact' }
        ])
        this.queryStrings['page'] = {
            pageSize: 10,
            currentPage: 1
        }
        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._contactService.index_paged(this.queryStrings).
            subscribe(
            response => {
                console.log(response);
                this.contacts = response['contacts'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
    }


    /**
     * Datatable dependency
     * delete record
     * @param obj
     *   will contains ({model: Contact, pageSize: 10, currentPage: 1}) 
     */
    deleteRecord(obj: Object) {
        //delete process
        console.log(obj);
        let model: Contact = obj['model'];
        console.log(model);
        this._contactService.delete(model._id).subscribe((result) => {
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