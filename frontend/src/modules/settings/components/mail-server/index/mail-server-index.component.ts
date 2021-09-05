import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { MailServer, MailServerService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'mail-server-index-page',
    templateUrl: 'mail-server-index.component.html',
    styleUrls: ['mail-server-index.component.css']
})
export class MailServerIndexComponent implements OnInit {

    mailServers: MailServer[];
    //Datatable dependency
    dtColumns: any[] = [
        { name: 'title', label: 'Title', tooltip: 'Title', sortable: true, 'width': '30%' },
        { name: 'port', label: 'Port', sortable: true, 'width': '30%' },

    ];

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/settings/mail-servers/"
        },
        {
            'title': "Update",
            'icon': "update",
            'url': "/settings/mail-servers/update"
        },
        {
            'title': "Test",
            'icon': "email",
            'url': "/settings/mail-servers/test-mail"
        }
    ]

    //related pagination and sorting
    totalRecords: number;
    queryStrings: Object = {};


    constructor(
        private _mailServerService: MailServerService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Mail Server'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Mail Server' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._mailServerService.index_paged(this.queryStrings).
            subscribe(
            response => {
                console.log(response);
                this.mailServers = response['mailServers'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
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