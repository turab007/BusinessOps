import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { LeadService, Technology, Lead } from 'modules/business-opps';

@Component({
    selector: 'account-dialog',
    templateUrl: 'account-dialog.component.html',
})
export class AccountDialogComponent {

    public pageAction: string;

    public fg: FormGroup;
    public submitted: boolean;
    public pageTitle: string
    public editMode: boolean = true;
    public lead: Lead;
    public lead_id: string;



    //--
    objectsModel: any[];

    public componentLabels = {
        name: 'Name',
        contact_name: 'Contact Person',
        company_name: 'Organization',
        owner: 'Owner',
    }

    constructor(
        public dialogRef: MatDialogRef<AccountDialogComponent>,
        private _fb: FormBuilder,
        private _leadService: LeadService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
        try {
            this.pageAction = this.data.pageAction;
            // the short way
            this.fg = this._fb.group({
                name: [[], [<any>Validators.required]],
                contact_name: [[], []],
                company_name: [[], []],
                //======== need to add in models as well as
                owner: [[], [<any>Validators.required]], 
            });
            this.lead = this.data.lead;
            this.lead_id = this.data.lead_id;
            this.fg.patchValue(this.lead);

            this.pageTitle = "Create Account";

            //-=-

        }
        catch (e) {
            console.log(e);
        }

    }

    /**
     * Disable the form and hide the action buttons
     * @param status 
     */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.fg.disable();
        }
        else {
            this.fg.enable();
        }
        this.editMode = !status;
    }

    
    /**
     * Submit form
     * @param model 
     * @param isValid 
     */
    public save(model: Lead, isValid: boolean) {
        this.submitted = true;
        if (isValid) {
            console.log(model);
           
        }
    }

}