import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { BusinessGroup } from 'modules/settings';
import { BusinessGroupService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { FlashService } from 'modules/layout/services/flash.service';
import { FormValidator } from 'modules/settings/validators/form-validator'
import { menuArr } from 'modules/settings/menu'



@Component({
    selector: 'business-group-form-page',
    templateUrl: 'business-group-form.component.html',
    styleUrls: ['business-group-form.component.css']
})
export class BusinessGroupFormComponent implements OnInit {
    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public businessGroupForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private businessGroup: BusinessGroup;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = { name: 'Name', description: 'Description', status: 'Status' }


    constructor(
        private _fb: FormBuilder, private _businessGroupService: BusinessGroupService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Business Groups'
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {
            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];

            // the short way
            this.businessGroupForm = this._fb.group({
                name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                description: [''],
                status: [false]
            });
            //set form helper
            this.formHelper = new FormHelper(this.businessGroupForm, this.componentLabels);

            // TODO:low: update actions from string to enum...
            if (this.pageAction == "view") {
                this.setRecord();
                this._disableForm(true);
            }
            else if (this.pageAction == "update") {
                this.setRecord();
                this._disableForm(false);
            }
            else if (this.pageAction == "create") {
                this._disableForm(false);
            }
        }
        catch (e) {
            console.log(e);
        }

    }
    /**
     * TODO:low: (Have to find a better way to do that)
     * This method we need on all components where the custom validaton will part to play from services
     * @param Unqiue level  
     */

    private _validateCustomRules(fieldControl: FormControl) {
        this.route.params.subscribe(
            params => {
                let recordId = params['id'];
                FormValidator.verifyUniqueBusinessGroup(fieldControl, this._businessGroupService, recordId)


            });

    }
    /**
     * Disable the form and hide the action buttons
     * @param status 
     */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.businessGroupForm.disable();
        }
        else {
            this.businessGroupForm.enable();
        }
        this.editMode = !status;
    }
    /**
     * TODO:Low refinement
     * Set Business Group based on 
     */
    setRecord(): void {
        this._loadingService.register('overlayStarSyntax');

        this.route.params.subscribe(
            params => {

                let recordId = params['id'];
                this._businessGroupService.findByID(recordId).
                    subscribe(
                    businessGroup => {
                        this.businessGroup = businessGroup;

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/settings/business-groups', title: 'Business Groups' },
                            { title: this.businessGroup.name },
                        ])

                        this.businessGroupForm.reset();
                        this.businessGroupForm.patchValue(businessGroup)
                        this._loadingService.resolve('overlayStarSyntax')

                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }


    save(model: BusinessGroup, isValid: boolean) {

        this.submitted = true;


        if (isValid) {
            this._loadingService.register('overlayStarSyntax');

            this._businessGroupService.save(model, this.businessGroup).subscribe(resp => {
                this.businessGroupForm.reset();

                FlashService.instance.setFlashMessage("Business Group","Date saved");
                this._loadingService.resolve('overlayStarSyntax');
                this.router.navigate(['/settings/business-groups', resp['_id']]);

            

            }, error => {
                this._loadingService.resolve('overlayStarSyntax');
                this.formHelper.handleSubmitError(error);
            })
        }
    }

    /**
  * delete record
  * @param model 
  */
    deleteRecord(model: BusinessGroup) {
        this._businessGroupService.delete(model._id).subscribe((result) => {
            if (result) {
                this.router.navigate(['/settings/business-groups']);
            }
        }, error => {
            // call back error
        })
    }



    /**
    * Set overlay toggle tracking
    */
    private toggleOverlayStarSyntax(): void {
        if (!this.overlayStarSyntax) {
            this._loadingService.register('overlayStarSyntax');
        } else {
            this._loadingService.resolve('overlayStarSyntax');
        }
        this.overlayStarSyntax = !this.overlayStarSyntax;
    }
}