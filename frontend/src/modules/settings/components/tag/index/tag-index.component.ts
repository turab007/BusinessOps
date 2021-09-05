import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { Tag, TagService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'tag-index-page',
    templateUrl: 'tag-index.component.html',
    styleUrls: ['tag-index.component.css']
})
export class TagIndexComponent implements OnInit {

    tags: Tag[];
    //Datatable dependency
    dtColumns: any[] = [
        { name: 'name', label: 'Name', tooltip: 'Name', sortable: true, 'width': '30%' },
        { name: 'data_type', label: 'Type', sortable: true, 'width': '30%' },

    ];

    // Datatable dependency
    actionButtons: any[] = [
        {
            'title': "View",
            'icon': "visibility",
            'url': "/settings/tags/view"
        },
        {
            'title': "Update",
            'icon': "update",
            'url': "/settings/tags/update"
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
        private _tagService: TagService,
        private router: Router,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Tags'
        this.menuService.setMenu(menuArr);

    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Tags' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        console.log('servies');
        this._tagService.index_paged(this.queryStrings).
            subscribe(
            response => {
                this.tags = response['tags'];
                this.totalRecords = response["totalCount"];
            },
            error => console.log(error)
            ) // end of subscribe
    }


    /**
     * Datatable dependency
     * delete record
     * @param obj
     *   will contains ({model: Tag, pageSize: 10, currentPage: 1}) 
     */
    deleteRecord(obj: Object) {
        //delete process
        let model: Tag = obj['model'];
        this._tagService.delete(model._id).subscribe((result) => {
            if (result) {
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