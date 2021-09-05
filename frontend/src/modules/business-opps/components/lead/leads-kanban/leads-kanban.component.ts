import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { MatSnackBar } from '@angular/material';
import { _ } from 'lodash-node';

import { Lead, LeadService } from 'modules/business-opps/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'leads-kanban-page',
    templateUrl: 'leads-kanban.component.html',
    styleUrls: ['leads-kanban.component.css']
})
export class LeadsKanbanComponent implements OnInit {


    public leads: Lead[] = [];
    public kanBanData: Object;

    public many: Array<string> = ['The', 'possibilities', 'are', 'endless!'];
    public many2: Array<string> = ['Explore', 'them'];

    constructor(
        private dragulaService: DragulaService,
        private _leadService: LeadService,
        private router: Router,
        private menuService: LayoutService,
        public snackBar: MatSnackBar
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Lead'
        this.menuService.setMenu(menuArr);

        // dragulaService.setOptions('second-bag', {
        //     revertOnSpill: true
        // });
        let that = this;
        dragulaService.drop.subscribe((value) => {

         
            // console.log(`drop: ${value[0]}`);
            // this.onDrop(value.slice(1));
            const [e1, lead, status] = value;
            console.log('lead id is:', lead.dataset.id);
            console.log('status id is: ', status.dataset.id);



            that._leadService.update(lead.dataset.id, <Lead>{ status: status.dataset.id }).subscribe(resp => {
                that.snackBar.open("Lead Moved..", "Lead", {
                    duration: 1000,
                })
            })
            console.log("==================");
            /**
            * For local storage 
            */
            /*
                for (let index in this.leads) {
                    if (this.leads[index].name == lead.dataset.id) {
                        this.leads[index].status = status.dataset.id
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
            { title: 'Lead' }
        ])

        this._loadData();
    }


    private _loadData(): void {
        this._leadService.getLeedsForKanBan().subscribe(resp => {
            this.kanBanData = resp;
            console.log(this.kanBanData);

        }, error => {

        })
    }
}