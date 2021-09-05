import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { Contact } from 'modules/business-opps/';
import { ContactService, CompanyService } from 'modules/business-opps';
import { LayoutService } from 'modules/layout/services/layout.service';

import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'contact-form-page',
    templateUrl: 'contact-form.component.html',
    styleUrls: ['contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public contactForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private contact: Contact;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = {
        first_name: 'First Name', last_name: 'Last Name', account: 'Account',
        company: 'Company', email: 'Email',
        phone: 'Phone', mobile: 'Mobile',
        fax: 'Fax', skype_id: 'Skype Id', website: 'Website',
        mailing_street: 'Mailing Street', city: 'City', state: 'State/Province',
        zip: 'Zip Code', country: 'Country', description: 'Description',

    }



    constructor(
        private _fb: FormBuilder,
        private _contactService: ContactService, private _companyService: CompanyService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Contact'
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {


            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];

            // the short way
            this.contactForm = this._fb.group({
                first_name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                last_name: [''],
                account: ['', [<any>Validators.maxLength(25)]],
                company: [''],
                company_title: [''],
                email: ['', [<any>Validators.pattern("[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), <any>Validators.maxLength(40), this._validateCustomRules.bind(this)]],
                phone: [''],
                mobile: [''],
                fax: [''],
                website: [''],
                skype_id: [''],
                mailing_street: [''],
                city: [''],
                state: [''],
                zip: [''],
                country: [''],
                description: ['']
            });

            //set form helper
            this.formHelper = new FormHelper(this.contactForm, this.componentLabels);

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
                // FormValidator.verifyUniqueEmail(fieldControl, this._contactService, userId)

            });

    }

    /**
     * Disable the form and hide the action buttons
     * @param status 
    */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.contactForm.disable();
        }
        else {
            this.contactForm.enable();
        }
        this.editMode = !status;
    }



    /**
     * TODO:Low refinement
     * Set Contact based on 
     */
    setRecord(): void {
        this._loadingService.register('overlayStarSyntax');

        this.route.params.subscribe(
            params => {

                let recordId = params['id'];
                this._contactService.findByID(recordId).
                    subscribe(
                    contact => {
                        console.log(contact);

                        this.contact = contact;

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/business-opps/contacts', title: 'Contact' },
                            { title: this.contact.first_name },
                        ])

                        this.contactForm.reset();
                        this.contactForm.patchValue(contact)
                        this._loadingService.resolve('overlayStarSyntax')

                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }


    save(model: Contact, isValid: boolean) {

        this.submitted = true;


        if (isValid) {
            console.log(model);
            this._loadingService.register('overlayStarSyntax');

            this._contactService.save(model, this.contact).subscribe(resp => {
                console.log(resp);
                this.contactForm.reset();
                this.snackBar.open("Date saved", "Contact", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');
                    
                    //this.router.navigate(['/business-opps/contacts/view/', resp['_id']]);
                    
                    /** New requirement **/    
                    this.router.navigate(['/business-opps/contacts']);
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
    deleteRecord(model: Contact) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._contactService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/business-opps/contacts']);
                    }
                }, error => {
                    // call back error
                })
            }
        });
    }

}