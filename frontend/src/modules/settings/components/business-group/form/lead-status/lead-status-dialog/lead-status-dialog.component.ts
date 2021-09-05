import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { StatusFlow } from 'modules/settings';
import { StatusFlowService } from 'modules/settings';

@Component({
    selector: 'lead-status-dialog',
    templateUrl: 'lead-status-dialog.component.html',
})
export class LeadStatusDialogComponent {

    public pageAction: string;

    public fg: FormGroup;
    public submitted: boolean;
    private statusFlow: StatusFlow;
    public pageTitle: string
    public editMode: boolean = true;

    public componentLabels = {
        name: 'Name', description: 'Description',
        business_group_id: 'none', type: 'none', weight: 'Weight/Order'
    }

    constructor(
        public dialogRef: MatDialogRef<LeadStatusDialogComponent>,
        private _fb: FormBuilder,
        private _statusFlowService: StatusFlowService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
        try {
            this.pageAction = this.data.pageAction;

            console.log(this.data);

            // the short way
            this.fg = this._fb.group({
                name: ['', [<any>Validators.required, <any>Validators.maxLength(55)]],
                description: [''],
                business_group_id: ['', [<any>Validators.required]],
                type: ['', [<any>Validators.required]],
                status: [true],
                weight: ['']
            });

            this.fg.patchValue({
                business_group_id: this.data.business_group_id,
                type: this.data.type
            });

            // TODO:low: update actions from string to enum...
            if (this.pageAction == "view") {
                this.pageTitle = "View Lead Status";
                this.getData();
                this._disableForm(true);
            }
            else if (this.pageAction == "update") {
                this.pageTitle = "Edit Lead Status";
                this.getData();
                this._disableForm(false);
            }
            else if (this.pageAction == "create") {
                this.pageTitle = "Add new Lead Status";
                this._disableForm(false);
            }
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
     * TODO:Low refinement
     * Set user based on 
     */
    getData(): void {
        let id = this.data._id;
        this._statusFlowService.findByID(id).subscribe(
            response => {
                this.statusFlow = response;
                this.fg.patchValue(this.statusFlow);
            },
            error => {
            })
    }
    /**
     * Submit form
     * @param model 
     * @param isValid 
     */
    public save(model: StatusFlow, isValid: boolean) {

        this.submitted = true;

        this._statusFlowService.save(model, this.statusFlow).subscribe((result) => {
            this.statusFlow = result;
            this.dialogRef.close(true);
        }, error => {

        })
    }
}