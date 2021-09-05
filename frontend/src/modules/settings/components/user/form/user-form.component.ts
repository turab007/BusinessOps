import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from './../../../../shared/helpers/form.helper'
import { User } from './../../../view-models/user';
import { FormError } from './../../../view-models/form-error';
import { UserService } from './../../../services/user.service';
import { LayoutService } from 'modules/layout/services/layout.service';
import { FormValidator } from './../../../validators/form-validator'
import { menuArr } from 'modules/settings/menu'
import { EmployeeService } from '../../../../employee';

@Component({
    selector: 'user-form-page',
    templateUrl: 'user-form.component.html',
    styleUrls: ['user-form.component.css'],
    providers: [EmployeeService]
})


export class UserFormComponent implements OnInit {
    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;

    public userRoles: any[];
    public userBusinessGroups: any[];
    public pageAction: string;

    public formHelper: FormHelper
    public userForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private user: User;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = { first_name: 'First Name', last_name: 'Last Name', user_id: 'Email', emp_jobTtile: "Employee Job Title" }

    constructor(
        private _fb: FormBuilder, private _userService: UserService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
        private menuService: LayoutService,
        private _employeeService: EmployeeService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Users'
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {
            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];

            // the short way
            this.userForm = this._fb.group({
                first_name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                last_name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                user_id: ['', [<any>Validators.pattern("[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$"), <any>Validators.maxLength(40), this._validateCustomRules.bind(this)]],
                status: [true],
                is_admin: [false],
                is_employee: [false],
                 emp_jobTtile:['']

            });
                console.log("employee control value ",this.userForm.controls.is_employee.value);
            if (this.userForm.controls.is_employee.value) {
                this.userForm.controls.emp_jobTtile.setValidators([Validators.required]);
            }
            //set form helper
            this.formHelper = new FormHelper(this.userForm, this.componentLabels);

            // TODO:low: update actions from string to enum...
            if (this.pageAction == "view") {
                this.setUser();
                this._disableForm(true);
            }
            else if (this.pageAction == "update") {
                this.setUser();
                this._disableForm(false);
            }
            else if (this.pageAction == "create") {

                this._disableForm(false);
                // this.userForm.setValidators(this._validateCustomRules.bind(this));
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
                let userId = params['id'];
                FormValidator.verifyUniqueEmail(fieldControl, this._userService, userId)

            });

    }

    /**
     * Disable the form and hide the action buttons
     * @param status 
     */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.userForm.disable();
        }
        else {
            this.userForm.enable();
        }
        this.editMode = !status;
    }
    /**
     * TODO:Low refinement
     * Set user based on 
     */
    setUser(): void {
        this._loadingService.register('overlayStarSyntax');
        this.userRoles = [];
        this.route.params.subscribe(
            params => {
                let userId = params['id'];
                this._userService.get(userId).
                    subscribe(
                    user => {
                        console.log(user);

                        this.user = user;

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/settings/users', title: 'Users' },
                            { title: this.user.first_name + " " + this.user.last_name }
                        ])

                        this.userRoles = user.roles;
                        this.userBusinessGroups = user.businessGroups;
                        this.userForm.patchValue(user);
                        console.log("this is user form ",this.userForm);
                        this._loadingService.resolve('overlayStarSyntax');
                        //setting errors false on load
                        this.userForm.setErrors({});


                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }


    save(model, isValid: boolean) {

        this.submitted = true;
        model.roles = this.userRoles;
        model.businessGroups = this.userBusinessGroups;

        if (isValid) {
            // this._loadingService.register('overlayStarSyntax');

            console.log("this is user ", model);


            this._userService.save(model, this.user).subscribe(resp => {

                if (model.is_employee) {
                    console.log("i am employee");
                    let emp = {
                        user: resp._id,
                        job_title: {

                            value: this.userForm.controls.emp_jobTtile.value
                        }
                    }
                    this._employeeService.save(emp).subscribe(response => {
                        console.log("this is response of saved employee", response);
                    })


                }
                this.snackBar.open("Date saved", "User", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');
                    this.userForm.reset();
                    this.router.navigate(['/settings/users', resp['_id']]);
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
    deleteRecord(model: User) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._userService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/settings/users']);
                    }
                }, error => {
                    // call back error
                })
            }
        });
    }

    pushRole(userRoles: any[]) {
        this.userRoles = userRoles;
    }

    pushGroup(userBusinessGroups: any[]) {
        this.userBusinessGroups = userBusinessGroups;
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