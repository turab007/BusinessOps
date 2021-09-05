import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { LeadService, Technology, Lead } from 'modules/business-opps';

@Component({
    selector: 'lead-interests-dialog',
    templateUrl: 'lead-interests-dialog.component.html',
})
export class LeadInterestsDialogComponent {

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
        intersted_in: 'Interested In',
    }

    constructor(
        public dialogRef: MatDialogRef<LeadInterestsDialogComponent>,
        private _fb: FormBuilder,
        private _leadService: LeadService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
        try {
            this.pageAction = this.data.pageAction;
            // the short way
            this.fg = this._fb.group({
                intersted_in: [[], [<any>Validators.required]],
                // intersted_in_test: [[], [<any>Validators.required]],
            });
            this.lead = this.data.lead;
            this.lead_id = this.data.lead_id;
            this.fg.patchValue(this.lead);

            this.pageTitle = "Lead Interests";
            this.setTechnologies();
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
     * set All Technologies here that will be populate in 
     * interested in (select box)
    */
    private setTechnologies(): void {

        this._leadService.getTechnologies().subscribe(resp => {
            this.interestedTechnologies = resp;
            this.filterTechnologyObjects('');


        }, error => {

        })
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
    ///---
    filterTechnologyObjects(value: string): void {
        this.filteredTechnologies = this.interestedTechnologies.filter((obj: any) => {
            if (value) {
                console.log(obj.name);
                return obj.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            } else {
                return false;
            }
        }).filter((filteredObj: any) => {
            // console.log(this.objectsModel);
            return this.objectsModel ? this.objectsModel.indexOf(filteredObj) < 0 : true;
        });
    }

    removeTechnology() {

    }
    addTechnology() {
        console.log('add');
        console.log(this.filteredTechnologies);
    }
}