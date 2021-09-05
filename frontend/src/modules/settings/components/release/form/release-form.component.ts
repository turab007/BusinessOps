import { Component, trigger, state, style, animate, transition } from '@angular/core';

import { TdDialogService } from '@covalent/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';


import { MatSnackBar } from '@angular/material';
// import { PageActions } from 'modules/app';
import { FormHelper } from 'modules/shared/helpers/form.helper'

import { _ } from 'lodash-node';

import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

import { Release, ReleaseService } from 'modules/settings/';


@Component({
    selector: 'release-form',
    templateUrl: 'release-form.component.html',
    styleUrls: ['release-form.component.css'],
})
export class ReleaseFormComponent{

    public pageAction: string;

    public pageTitle: string;
    public submitted: boolean; // keep track on whether form is submitted
    public formHelper: FormHelper
    public fg: FormGroup; // our model driven form

    public componentLabels = {
        name: 'Release Name',
        version: 'Version',
        description: 'Description'
    }
    
    
    public _releaseModel: Release;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _fb: FormBuilder,
        private _releaseService: ReleaseService,
        public snackBar: MatSnackBar,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //ToDO:low take this to central place
        menuArr['sub_module'] = 'Releases'
        this.menuService.setMenu(menuArr);
    }


    ngOnInit() {

        this._initReleaseForm();

        this.pageAction = this.route.snapshot.data.action;

        // TODO:low: update actions from string to enum...
        if (this.pageAction == 'view') {
            this.pageTitle = "View Release";
            this._loadFormData();
            this._disableForm(true);
        }
        else if (this.pageAction == 'update') {
            this.pageTitle = "Update Release";
            this._loadFormData();
            this._disableForm(false);
        }
        else if (this.pageAction == 'create') {
            this.pageTitle = "Create New Release";
            this._disableForm(false);
        }
    }

    /**
     * Init Form
     */
    private _initReleaseForm() {

        this.fg = this._fb.group({
            name: ['', [<any>Validators.required]],
            version: ['', [<any>Validators.required]],
            description: ['']
        });

        //set form helper
        this.formHelper = new FormHelper(this.fg, this.componentLabels);
    }

    /**
     * Disable/Enable Form
     * 
     * @param status boolean
     */
    private _disableForm(status: boolean) {

        if (status == true) {
            this.fg.disable();
        }
        else {
            this.fg.enable();
        }
    }

    /**
     * Load form data
     * 
     */
    private _loadFormData() {
        this.route.params.subscribe(
            params => {
                let id = params['id'];

                this._releaseService.findByID(id).subscribe((result) => {

                    this._releaseModel = result;

                    this.menuService.setBreadCrumb([
                        { url: '/dashboard', title: 'Dashboard' },
                        { url: '/settings/releases', title: 'Releases' },
                        { title: this._releaseModel.name }
                    ])

                    this.fg.patchValue(this._releaseModel);

                }, error => {

                })
                // console.log(id);
            });
    }

    /**
     * Save Release
     * 
     * @param model Release
     * @param isValid boolean
     */
    public save(model: Release, isValid: boolean) {

        this.submitted = true;

        if (this.route.snapshot.data.action == "create") {

            this._releaseService.save(model).subscribe((result) => {
                this._releaseModel = result;
                this.showFlashAndRedirect("Data saved", "Release", result._id);
            }, error => {

            })
        }
        else if (this.route.snapshot.data.action == "update") {
            console.log(model);
            this._releaseService.update(this._releaseModel._id, model).subscribe((result) => {
                this.showFlashAndRedirect("Data saved", "Release", this._releaseModel._id);
            }, error => {

            })

        }
    }

    deleteRecord(model: Release) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._releaseService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/settings/releases/']);
                    }
                }, error => {

                })
            }
        });

    }

    //TODO:low: move following error handling functions to some proper class.
    /**
     * Will redirect to release update page
     * @param message 
     * @param title 
     * @param id 
     */
    private showFlashAndRedirect(message: string, title: string, id: string) {
        this.snackBar.open(message, title, {
            duration: 2000,
        }).afterDismissed().subscribe(() => {
            //redirecting to user
            this.router.navigate(['/settings/releases/view', id]);
        });
    }
}