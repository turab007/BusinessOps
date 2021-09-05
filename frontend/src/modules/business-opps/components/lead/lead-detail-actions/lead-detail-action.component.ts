import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { 
        Lead,Contact, 
        LeadService, CompanyService, ContactService,
        LeadInterestsDialogComponent,LeadParticipantsDialogComponent,AccountDialogComponent 
    } from 'modules/business-opps/';
import { StatusFlow, StatusFlowService,UserService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';

import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'lead-detail-action-page',
    templateUrl: 'lead-detail-action.component.html',
    styleUrls: ['lead-detail-action.component.css'],
    providers: [StatusFlowService,UserService]
})

export class LeadDetailActionComponent implements OnInit {

    private dialogRefInterest: MatDialogRef<LeadInterestsDialogComponent>;
    private dialogRefParticipant: MatDialogRef<LeadParticipantsDialogComponent>;
    private dialogRefAccount: MatDialogRef<AccountDialogComponent>;

    public lead: Lead;
    public particpants:Contact;
    public businessGroupStatuses: StatusFlow[];

    constructor(

        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService, private _dialogService: TdDialogService,
        private _leadService: LeadService, private _statusFlowService: StatusFlowService,
        private _companyService: CompanyService, private _contactService: ContactService,
        private _userService: UserService,private menuService: LayoutService,
        public dialog: MatDialog
    ) {
       
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {
            this.setRecord();

        }
        catch (e) {
            console.log(e);
        }

    }

    /**
     * Dialoge will be open and will give interface to add interests
    */
    openTechnologiesDialog(id?: string) {
        this.dialogRefInterest = this.dialog.open(LeadInterestsDialogComponent, {
            width: '600px',
            disableClose: false,
            data: {
                lead_id: id,
                lead: this.lead,
            }
        });

        this.dialogRefInterest.afterClosed().subscribe((result: boolean) => {
            if (result == true) {
                this.setRecord();
            }
            this.dialogRefInterest = null;
        });
    }
    
    /**
     * Dialoge will be open and will give interface to add interests
    */
    openParticpantsDialog(id?: string) {
        this.dialogRefParticipant = this.dialog.open(LeadParticipantsDialogComponent, {
            width: '600px',
            disableClose: false,
            data: {
                lead_id: id,
                lead: this.lead,
            }
        });

        this.dialogRefParticipant.afterClosed().subscribe((result: boolean) => {
            if (result == true) {
                this.setRecord();
            }
            this.dialogRefParticipant = null;
        });
    }
    /**
     * Dialoge will be open and will show account
    */
    openAccountDialog(id?: string) {
        this.dialogRefAccount = this.dialog.open(AccountDialogComponent, {
            width: '600px',
            disableClose: false,
            data: {
                lead_id: id,
                lead: this.lead,
            }
        });

        this.dialogRefAccount.afterClosed().subscribe((result: boolean) => {
            if (result == true) {
                this.setRecord();
            }
            this.dialogRefAccount = null;
        });
    }
    /**
     *
     * Set Lead based on 
     */
    setRecord(): void {
        this._loadingService.register('overlayStarSyntax');

        this.route.params.subscribe(
            params => {

                let recordId = params['id'];
                this._leadService.findByID(recordId).
                    subscribe(
                    lead => {
                        this.lead = lead;
                         //TODO:Low (Take this to centeral place)
                        menuArr['sub_module'] = this.lead.name

                        console.log(lead);
                        this.loadAllBusinssGroupStatues(lead.business_group);
                        this.loadTimeZone(lead.time_zone);
                        this.loadContact(lead);
                        this.loadContactCompany(lead.company_id);
                        this._loadingService.resolve('overlayStarSyntax')
                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }
    //load lead timezone
    private loadTimeZone(zone_id: string) {
        if(zone_id)
            this._leadService.findZoneByID(zone_id).
                subscribe(
                zone => {
                    this.lead.time_zone = zone.name;
                },
                error => { })
    }

    /**
    * Load all the business group status
    * @param business_group_id 
    */
    private loadAllBusinssGroupStatues(business_group_id: String) {
        let queryString = { 'filter': { 'business_group_id': business_group_id, 'type': 'Lead' } };

        return this._statusFlowService.index_paged(queryString).
            subscribe(resp => {
                this.businessGroupStatuses = resp['statuses'];
                console.log(resp);
            },
            error => { })
    }
 
    /**
     * Load company name
     * @param company_id 
     */
    private loadContactCompany(company_id: string) {
        if(company_id)
            this._companyService.findByID(company_id).
                subscribe(
                company => {
                    this.lead.company_name = company.name;
                },
                error => { })
    }
    /**
     * 
     * @param contact_id 
     */
    private loadContact(lead: Lead) {
        if (lead.contact_id) {
            this._contactService.findByID(lead.contact_id).
                subscribe(contact => {  this.lead.relatedContact = contact })
          
        }
        else {
            this.lead.relatedContact = {};
            this.lead.relatedContact['name'] = lead.contact_name;
        }
        
    }

}