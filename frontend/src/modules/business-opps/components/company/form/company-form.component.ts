import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { Company } from 'modules/business-opps/';
import { CompanyService } from 'modules/business-opps';
import { LayoutService } from 'modules/layout/services/layout.service';

import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'company-form-page',
    templateUrl: 'company-form.component.html',
    styleUrls: ['company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public companyForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private company: Company;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = {
        name: 'Name', address: 'Address',
        email: 'Email', city: 'City', state: 'State/Province',
        zip: 'Zip Code', country: 'Country',
        phone: 'Phone', mobile: 'Mobile',
        fax: 'Fax', website: 'Website',
        description: 'Description',

    }



    constructor(
        private _fb: FormBuilder, private _companyService: CompanyService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Company'
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {


            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];

            // the short way
            this.companyForm = this._fb.group({
                name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                address: [''],
                city: [''],
                state: [''],
                zip: [''],
                country: [''],
                email: ['', [<any>Validators.pattern("[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), <any>Validators.maxLength(40), this._validateCustomRules.bind(this)]],
                phone: [''],
                mobile: [''],
                fax: [''],
                website: [''],
                description: ['']
            });

            //set form helper
            this.formHelper = new FormHelper(this.companyForm, this.componentLabels);

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
     * @param fieldControl 
     */
    private _validateCustomRules(fieldControl: FormControl) {

        this.route.params.subscribe(
            params => {
                let userId = params['id'];
                // FormValidator.verifyUniqueEmail(fieldControl, this._companyService, userId)

            });

    }

    /**
     * Disable the form and hide the action buttons
     * @param status 
    */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.companyForm.disable();
        }
        else {
            this.companyForm.enable();
        }
        this.editMode = !status;
    }



    /**
     * TODO:Low refinement
     * Set Company based on 
     */
    setRecord(): void {
        this._loadingService.register('overlayStarSyntax');

        this.route.params.subscribe(
            params => {

                let recordId = params['id'];
                this._companyService.findByID(recordId).
                    subscribe(
                    company => {


                        console.log(company);

                        this.company = company;

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/business-opps/companies', title: 'Company' },
                            { title: this.company.name },
                        ])

                        this.companyForm.reset();
                        this.companyForm.patchValue(company)
                        this._loadingService.resolve('overlayStarSyntax')


                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }


    save(model: Company, isValid: boolean) {

        this.submitted = true;


        if (isValid) {
            console.log(model);
            this._loadingService.register('overlayStarSyntax');

            this._companyService.save(model, this.company).subscribe(resp => {
                console.log(resp);
                this.companyForm.reset();
                this.snackBar.open("Date saved", "Company", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');
                    this.router.navigate(['/business-opps/companies/view/', resp['_id']]);
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
    deleteRecord(model: Company) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._companyService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/business-opps/companies']);
                    }
                }, error => {
                    // call back error
                })
            }
        });
    }

}