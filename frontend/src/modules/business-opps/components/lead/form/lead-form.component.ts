import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { Lead, Technology, Contact } from 'modules/business-opps/';
import { BusinessGroup, StatusFlow, StatusFlowService,UserService } from 'modules/settings/';
import { LeadService, ContactService, CompanyService } from 'modules/business-opps';
import { LayoutService } from 'modules/layout/services/layout.service';

import { menuArr } from 'modules/business-opps/menu'

@Component({
    selector: 'lead-form-page',
    templateUrl: 'lead-form.component.html',
    styleUrls: ['lead-form.component.css'],
    providers: [StatusFlowService,UserService]

})
export class LeadFormComponent implements OnInit {

    inputArray: any[];

    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public leadForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private lead: Lead;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = {
        name: 'Name', description: 'Description', status: 'Status',
        business_group: 'Business Group',
        contact_name: 'Add Contact Name', contact_id: 'Select Existing Contact',
        company_name: 'Add Organization Name', company_id: 'Existing Organization',
        designation: 'Designation', address1: 'Address Line 1',
        address2: 'Address Line 2', address_city: 'City', address_zip: 'Zip Code',
        address_state: 'State/Province', address_country: 'Country', time_zone: 'Select Time Zone',
        intersted_in: 'Interested In', participants: 'Participants', contact_modes: 'Contact Modes', is_active: 'Active'
    }
    //interested technologies will  come here and user select
    public interestedTechnologies: Technology[];
    //business group will be populated against current user
    public businessGroups: BusinessGroup[];
    //selected business Group statuses
    public businessGroupStatuses: StatusFlow[];

    //auto complete

    contactOptions: Contact[];

    filteredOptions: Observable<string[]>;

    contactQueryStrings: Object = {};
    filteredObjects: string[];

    constructor(
        private _fb: FormBuilder,
        private _leadService: LeadService, private _contactService: ContactService,
        private _companyService: CompanyService, private _statusFlowService: StatusFlowService,
        private _userService: UserService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Lead'
        
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {

            this.setTechnologies();
            this.loadAllBusinesGroups();
            //
            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];

            // the short way
            this.leadForm = this._fb.group({
                name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                contact_name: [''],
                business_group: ['', [<any>Validators.required]],
                contact_id_title: [''], // a readonly field
                contact_id: [''],
                contact_type: ['new'], // helping variables (existing or new)
                company_name: [''],
                company_id: [''],
                company_type: ['new'],  // helping variables (existing or new)
                company_id_title: [''],
                designation: [''],
                address1: [''],
                address2: [''],
                address_city: [''],
                address_zip: [''],
                address_state: [''],
                address_country: [''],
                time_zone: [''],
                time_zone_title: [''],
                status: ['', [<any>Validators.required]],
                intersted_in: [[], [<any>Validators.required]],
                participants: [[], []],
                contact_modes: this._fb.array([]),
                description: [''],

                is_active: [false],
            });

            ///----------only for page action create------------
            if (this.pageAction == "create") {
                this.setContactModes();
                this.lead = <Lead>{};
                this.lead.company_type = this.leadForm.get('company_type').value;
                this.lead.contact_type = this.leadForm.get('contact_type').value;
            }
            //set form helper
            this.formHelper = new FormHelper(this.leadForm, this.componentLabels);

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
                this.setNewContactAllowed(); // allow new by default 
            }
            //set the change event of Business Group
            this.setBusinessGroupChange();
        }
        catch (e) {
            console.log(e);
        }

    }
    /**
     * Set contact modes initially
     */
    private setContactModes(): void {
        const arrayControl = <FormArray>this.leadForm.controls['contact_modes'];
        let newGroup = this._fb.group({
            value: ['', []],
            name: ['', []]
        });
        arrayControl.push(newGroup);
    }
    /**
     * add Contact modes
     */
    addInput(): void {
        const arrayControl = <FormArray>this.leadForm.controls['contact_modes'];
        let newGroup = this._fb.group({
            // Fill this in identically to the one in ngOnInit
            value: ['', []],
            name: ['', []]
        });
        arrayControl.push(newGroup);
    }
    /**
     * delete Contact modes
     * @param index 
     */
    delInput(index: number): void {
        const arrayControl = <FormArray>this.leadForm.controls['contact_modes'];
        arrayControl.removeAt(index);
    }
    /**
     * on contact selection event will decide that existing contact will be saved or new
     * @param value 
     */
    public onContactSelection(value: string): void {
        if (value == "new") {
            this.setNewContactAllowed();

        }
        else if (value == "existing") {
            this.setExistingContactAllowed();
        }
    }
    /**
     * on company selection event will decide that existing company will be saved or new
     * @param value 
     */
    public onCompanySelection(value: string): void {
        console.log(value);

        if (value == "new") {
            this.setNewCompanyAllowed();
        }
        else if (value == "existing") {
            // if contact already populated then load company again
            if (this.lead.company_id) {
                this.loadContactCompany(this.lead.company_id);
            }
            this.setExistingCompanyAllowed();
        }
    }
    /**
     * set Only New contact allowed
     */
    private setNewContactAllowed(): void {
        this.leadForm.get('contact_name').enable();
        this.leadForm.get('contact_id_title').disable();
        this.leadForm.get('contact_id').disable();
        this.leadForm.controls['contact_id'].setValue(null);
        this.leadForm.controls['contact_id_title'].setValue(null);
    }
    /**
     *  Set existing contact allowd
    */
    private setExistingContactAllowed(): void {
        this.leadForm.get('contact_name').disable();
        this.leadForm.get('contact_name').setValue("");
        this.leadForm.get('contact_id_title').enable();
        this.leadForm.get('contact_id').enable();

    }

    /**
     * set Only New company allowed
    */
    private setNewCompanyAllowed(): void {
        this.leadForm.get('company_name').enable();
        this.leadForm.get('company_id_title').setValue("");
        this.leadForm.controls['company_id'].setValue("");
        this.lead.company_type = 'new';
    }
    /**
     *  Set existing company allowd
    */
    private setExistingCompanyAllowed(): void {
        this.leadForm.get('company_name').disable();
        this.leadForm.get('company_name').patchValue("");
        this.lead.company_type = 'existing';
        console.log(this.lead);
        this.leadForm.get('company_type').patchValue(this.lead.company_type);
       
    }



    // filter(val: string): string[] {
    //     return this.options.filter(option => new RegExp(`^${val}`, 'gi').test(option));
    // }

    /**
     * Disable the form and hide the action buttons
     * @param status 
    */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.leadForm.disable();
        }
        else {
            this.leadForm.enable();
        }
        this.editMode = !status;

        //set disable true the company field
        this.leadForm.get('company_id_title').disable();
    }

    /**
     * set All Technologies here that will be populate in 
     * interested in (select box)
     */
    private setTechnologies(): void {

        this._leadService.getTechnologies().subscribe(resp => {
            this.interestedTechnologies = resp;

        }, error => {

        })
    }
    /**
     * A general call back methd required for save changes from child  and save to formGroup attribtue
     * @param obj 
     * @param controlName 
     */
    setChangedItems(obj: any) {
        /**  We may need this method if we are using different compoent on both parent and child 
         *   In this case I provide the same control as Input We dont need to following stuff
         *  this.leadForm.get(obj['controlName']).setValue(obj['data']);
         */

    }
    /**
    * A general call back methd required for gc-autocomplete component 
    * @param obj 
    * @param controlName 
    */
    setSelectedAutoCompleteItem(obj: any) {
        console.log(obj.controlName);
        switch (obj.controlName) {
            case "contact_id": {
                console.log((typeof obj.data.company));
                if (obj.data.company) {
                    if (typeof (this.lead) == "undefined") {
                        this.lead = <Lead>{};
                    }
                    if (typeof obj.data.company === 'string' || obj.data.company instanceof String) { // it's a string
                        this.loadContactCompany(obj.data.company);
                        this.lead['company_id'] = obj.data.company;
                    }
                    else {
                        this.loadContactCompany(obj.data.company._id);
                        this.lead.company_id = obj.data.company._id;
                    }


                }
                else {
                    this.leadForm.get('company_id').setValue("");
                    this.leadForm.get('company_id_title').setValue("");
                }
                break;
            }
            case "time_zone": {
                console.log(obj.data);
                if (obj.data._id) {
                    /*
                        if we need verification from database then uncomment following
                        other wise its working 
                    */
                    // this.loadTimeZone(obj.data._id)
                }
                else {
                    this.leadForm.get('time_zone').setValue("");
                    this.leadForm.get('time_zone_title').setValue("");
                }
                break;
            }
            default: {
                console.log("Invalid choice");
                break;
            }
        }

    }
    /**
     * set the change event of business group and get selected value
     */
    private setBusinessGroupChange() {
        this.leadForm.get('business_group').valueChanges.subscribe(business_group => {
            console.log(business_group);
            this.loadAllBusinssGroupStatues(business_group);
        });
    }
    /**
     * load company against lead
     * @param company_id 
     */
    private loadContactCompany(company_id: string) {
        this._companyService.findByID(company_id).
            subscribe(
            company => {

                this.leadForm.get('company_id').setValue(company._id);
                this.leadForm.get('company_id_title').setValue(company.name);
                console.log("--here--");
                console.log("-------");
    
                this.setExistingCompanyAllowed();
            },
            error => { })
    }
    /**
     * load timezone against lead
     * @param zone_id 
     */
    private loadTimeZone(zone_id: string) {
        this._leadService.findZoneByID(zone_id).
            subscribe(
            zone => {
                console.log(zone);
                this.leadForm.get('time_zone').setValue(zone._id);
                this.leadForm.get('time_zone_title').setValue(zone.name);
            },
            error => { })
    }
    /**
     * 
     * Get all business groups
     */
    private loadAllBusinesGroups() {
        return this._leadService.getBusinessGroupsByCurrentUser().
            subscribe(businessGroups => {

                this.businessGroups = businessGroups;
                console.log(this.businessGroups);
                return;
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
            },
            error => { })
    }

    /**
     * TODO:Low refinement
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
                        //lead company 
                        if (lead.company_id) {
                            this.loadContactCompany(lead.company_id)
                        }
                        if (lead.time_zone) {
                            this.loadTimeZone(lead.time_zone)
                        }

                        //take decsion to allow new contact or existing
                        if (lead.contact_id) {
                            this.setExistingContactAllowed();
                        }
                        else {
                            this.setNewContactAllowed();
                        }

                        this.lead.contact_modes.forEach(element => {
                            console.log(element);
                            this.setContactModes();
                        });

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/business-opps/leads', title: 'Lead' },
                            { title: this.lead.name },
                        ])

                        this.leadForm.reset();
                        this.leadForm.patchValue(lead)
                        this._loadingService.resolve('overlayStarSyntax')


                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }


    save(model: Lead, isValid: boolean) {

        this.submitted = true;


        if (isValid) {
            console.log(model);
            this._loadingService.register('overlayStarSyntax');

            this._leadService.save(model, this.lead).subscribe(resp => {
                console.log(resp);
                this.leadForm.reset();
                this.snackBar.open("Data saved", "Lead", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');

                    //this.router.navigate(['/business-opps/leads/view/', resp['_id']]);
                    
                    /** New requirement **/    
                    this.router.navigate(['/business-opps/leads']);
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
    deleteRecord(model: Lead) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._leadService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/business-opps/leads']);
                    }
                }, error => {
                    // call back error
                })
            }
        });
    }



}