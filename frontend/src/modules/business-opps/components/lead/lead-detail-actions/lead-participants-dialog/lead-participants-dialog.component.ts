import { Component, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { LeadService, Technology, Lead } from 'modules/business-opps';
import { UserService } from 'modules/settings';

@Component({
    selector: 'lead-participants-dialog',
    templateUrl: 'lead-participants-dialog.component.html',
     providers: [UserService]
})
export class LeadParticipantsDialogComponent {

    public pageAction: string;

    public fg: FormGroup;
    public submitted: boolean;
    public pageTitle: string
    public editMode: boolean = true;
    public lead: Lead;
    public lead_id: string;

    //----------------------------------



    //interested technologies will  come here and user select
    public interestedTechnologies: any[] = [];
    public filteredTechnologies: any[];

    //--
    objectsModel: any[];

    public componentLabels = {
        participants: 'Participants',
    }

    constructor(
        public dialogRef: MatDialogRef<LeadParticipantsDialogComponent>,
        private _fb: FormBuilder,
        private _leadService: LeadService,private _userService:UserService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
        try {
            this.pageAction = this.data.pageAction;
            // the short way
            this.fg = this._fb.group({
                participants: [[], [<any>Validators.required]],
            });
            
            this.lead = this.data.lead;
            console.log(this.lead);
            this.lead_id = this.data.lead_id;
            this.fg.patchValue(this.lead);

            this.pageTitle = "Lead Participants";
            // this.setTechnologies();
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
            this._leadService.update(this.lead_id, model).subscribe(resp => {
                 this.dialogRef.close(true);
            }, error => {

            })
        }
    }

}