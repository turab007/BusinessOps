import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { Tag } from 'modules/settings';
import { TagService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { FormValidator } from 'modules/settings/validators/form-validator'
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'tag-form-page',
    templateUrl: 'tag-form.component.html',
    styleUrls: ['tag-form.component.css']
})
export class TagFormComponent implements OnInit {
    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public tagForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private tag: Tag;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = { name: 'Name', description: 'Description', status: 'Status', data_type: 'Type' }

    //introducing tag types for dropdown
    public tagTypes: any[];


    constructor(
        private _fb: FormBuilder, private _tagService: TagService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Tags'
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {
            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];

            //getting tag types
            this.setTypes();

            // the short way
            this.tagForm = this._fb.group({
                name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                data_type: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                description: [''],
                status: [false]
            });
            //set form helper
            this.formHelper = new FormHelper(this.tagForm, this.componentLabels);

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
     * Disable the form and hide the action buttons
     * @param status 
     */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.tagForm.disable();
        }
        else {
            this.tagForm.enable();
        }
        this.editMode = !status;
    }
    /**
     * Set all types 
     */
    setTypes(): void {
        // this._loadingService.register('overlayStarSyntax');
        this._tagService.getTypes().subscribe(resp => {
            this.tagTypes = resp;
            // this._loadingService.resolve('overlayStarSyntax');
        }, error => {
            // this._loadingService.resolve('overlayStarSyntax');
        })
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
                this._tagService.findByID(recordId).
                    subscribe(
                    tag => {

                        this.tag = tag;

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/settings/business-groups', title: 'Business Groups' },
                            { title: this.tag.name },
                        ])

                        this.tagForm.reset();
                        this.tagForm.patchValue(tag)
                        this._loadingService.resolve('overlayStarSyntax')

                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }


    save(model: Tag, isValid: boolean) {

        this.submitted = true;


        if (isValid) {
            this._loadingService.register('overlayStarSyntax');

            this._tagService.save(model, this.tag).subscribe(resp => {
                this.tagForm.reset();
                this.snackBar.open("Date saved", "Tag", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');
                    this.router.navigate(['/settings/tags', resp['_id']]);
                });

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
    deleteRecord(model: Tag) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._tagService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/settings/tags']);
                    }
                }, error => {
                    // call back error
                })
            }
        });
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