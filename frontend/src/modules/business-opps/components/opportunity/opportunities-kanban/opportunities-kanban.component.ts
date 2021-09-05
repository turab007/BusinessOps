import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { MatSnackBar } from '@angular/material';

import { Opportunity, OpportunityService } from 'modules/business-opps/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'opportunities-kanban-page',
    templateUrl: 'opportunities-kanban.component.html',
    styleUrls: ['opportunities-kanban.component.css']
})
export class OpportunitiesKanbanComponent implements OnInit {


    public opportunitys: Opportunity[] = [];
    public kanBanData: Object;

    public many: Array<string> = ['The', 'possibilities', 'are', 'endless!'];
    public many2: Array<string> = ['Explore', 'them'];

    constructor(
        private dragulaService: DragulaService,
        private _opportunityService: OpportunityService,
        private router: Router,
        private menuService: LayoutService,
        public snackBar: MatSnackBar
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Opportunity'
        this.menuService.setMenu(menuArr);

        // dragulaService.setOptions('second-bag', {
        //     revertOnSpill: true
        // });
        let that = this;
        dragulaService.drop.subscribe((value) => {

            // console.log(`drop: ${value[0]}`);
            // this.onDrop(value.slice(1));
            const [bagName, opportunity, status] = value;
            console.log('opportunity id is:', opportunity.dataset.id);
            console.log('status id is: ', status.dataset.id);

            that._opportunityService.update(opportunity.dataset.id, <Opportunity>{ status: status.dataset.id }).subscribe(resp => {
                that.snackBar.open("Opportunity Moved..", "Opportunity", {
                    duration: 1000,
                })
            })
            /**
            * For local storage 
            */
            /*
                for (let index in this.opportunitys) {
                    if (this.opportunitys[index].name == opportunity.dataset.id) {
                        this.opportunitys[index].status = status.dataset.id
                    }
                }
            */

            // console.log('dragged', value.dragged); // the item which was dragged
            // console.log('bag', value.bag);
            // console.log('index', value.index); // index where the element was inserted into bag
            // console.log('after', value.after); // element after the inserted element
            // console.log('before', value.before); // element before the inserted element
        });

    }

    private onDrop(args) {
        let [el, target, source] = args;
    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Opportunity' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        this._opportunityService.getLeedsForKanBan().subscribe(resp => {
            this.kanBanData = resp;
            console.log(this.kanBanData);

        }, error => {

        })
    }
}