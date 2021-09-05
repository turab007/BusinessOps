import { Component, trigger, state, style, animate, transition } from '@angular/core';

import { TdDialogService } from '@covalent/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
// import { PageActions } from 'modules/app';
import { FormHelper } from './../../../../../shared/helpers/form.helper'

import { _ } from 'lodash-node';

import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

import { Role } from './../../../../view-models/role';
import { FormError } from './../../../../view-models/form-error';
import { ModuleApps } from './../../../../view-models/module-apps';
import { RoleService, ModuleService } from './../../../../';


@Component({
    selector: 'role-form',
    templateUrl: 'role-form.component.html',
    styleUrls: ['role-form.component.css'],
    providers: [ModuleService],
    animations: [
        trigger('activeState', [
            state('inactive', style({
                // backgroundColor: '#eee',
                transform: 'scale(.95)'
            })),
            state('active', style({
                backgroundColor: '#efefef',
                borderBottom: "1px solid #2196f3",
                transform: 'scale(1)'
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class RoleFormComponent{

    public pageAction: string;


    public pageTitle: string;
    public submitted: boolean; // keep track on whether form is submitted
    public formHelper: FormHelper
    public roleForm: FormGroup; // our model driven form

    public componentLabels = {
        name: 'Role Name',
        description: 'Description'
    }
    
    
    public _roleModel: Role;
    public moduleAps: ModuleApps[];
    public selectedModule: string;
    public checkbox_disabled: boolean;
    public rolePermissionsAry: any[] = [];
    public features: any[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _fb: FormBuilder,
        private _roleService: RoleService,
        private _moduleService: ModuleService,
        public snackBar: MatSnackBar,
        private _dialogService: TdDialogService,
        private menuService: LayoutService
    ) {
        //ToDO:low take this to central place
        menuArr['sub_module'] = 'Roles'
        this.menuService.setMenu(menuArr);
    }


    ngOnInit() {

        this._initRoleForm();

        this.pageAction = this.route.snapshot.data.action;
        console.log(this.pageAction);
        this.checkbox_disabled = (this.pageAction == 'view') ? true : false;

        // TODO:low: update actions from string to enum...
        if (this.pageAction == 'view') {
            this.pageTitle = "View Role";
            this._loadFormData();
            this._disableForm(true);
        }
        else if (this.pageAction == 'update') {
            this.pageTitle = "Update Role";
            this._loadFormData();
            this._disableForm(false);
        }
        else if (this.pageAction == 'create') {
            this.pageTitle = "Create New Role";
            this._loadModules();
            this._disableForm(false);
        }
    }

    /**
     * Init Form
     */
    private _initRoleForm() {

        this.roleForm = this._fb.group({
            name: ['', [<any>Validators.required]],
            description: ['']
        });

        //set form helper
        this.formHelper = new FormHelper(this.roleForm, this.componentLabels);
    }

    /**
     * Disable/Enable Form
     * 
     * @param status boolean
     */
    private _disableForm(status: boolean) {

        if (status == true) {
            this.roleForm.disable();
        }
        else {
            this.roleForm.enable();
        }
    }

    /**
     * Load form data
     * 
     */
    private _loadFormData() {
        this.route.params.subscribe(
            params => {
                let roleID = params['id'];
                let loadPermissions: number = 1;

                this._roleService.findByID(roleID, loadPermissions).subscribe((result) => {

                    this._roleModel = result;

                    this.menuService.setBreadCrumb([
                        { url: '/dashboard', title: 'Dashboard' },
                        { url: '/settings/roles', title: 'Roles' },
                        { title: this._roleModel.name }
                    ])

                    this.rolePermissionsAry = this._roleModel.permissions;

                    this.setCheckedStatus();

                    this.roleForm.patchValue(this._roleModel);

                    // Load modules and set default option
                    this._loadModules();

                }, error => {

                })
                // console.log(roleID);
            });
    }

    setCheckedStatus() {

        _.each(this.features, (featureObj) => {

            featureObj['index_checked'] = false;
            featureObj['update_checked'] = false;
            featureObj['create_checked'] = false;
            featureObj['delete_checked'] = false;

            _.each(this.rolePermissionsAry, (rolePermObj) => {

                if (featureObj['index_checked'] == false && featureObj.index_id == rolePermObj.permission_id) {
                    featureObj['index_checked'] = true;
                }
                if (featureObj['update_checked'] == false && featureObj.update_id == rolePermObj.permission_id) {
                    featureObj['update_checked'] = true;
                }
                if (featureObj['create_checked'] == false && featureObj.create_id == rolePermObj.permission_id) {
                    featureObj['create_checked'] = true;
                }
                if (featureObj['delete_checked'] == false && featureObj.delete_id == rolePermObj.permission_id) {
                    featureObj['delete_checked'] = true;
                }
            })
        })
    }

    /**
     * Load modules
     * 
     */
    private _loadModules() {

        this._roleService.getModules().subscribe((result) => {
            if (result) {

                this.moduleAps = result;
                _.each(this.moduleAps, moduleApp => {
                    moduleApp["activeState"] = "inactive";
                })
                this.loadFeatures(this.moduleAps[0]['module_id']);

            }
        }, error => {
            console.log(error);
        });

    }

    /**
     * Load features on click on any module
     * @param module_id strgin
     */
    public loadFeatures(module_id: string) {

        console.log(module_id);

        _.each(this.moduleAps, moduleApp => {
            moduleApp["activeState"] = "inactive";
            if (moduleApp.module_id == module_id) {
                moduleApp["activeState"] = "active";
                this.selectedModule = module_id;
                this.features = moduleApp.features;
                this.setCheckedStatus();
            }
        })
    }

    /**
     * Save Role
     * 
     * @param model Role
     * @param isValid boolean
     */
    public save(model: Role, isValid: boolean) {

        this.submitted = true;

        model.permissions = this.rolePermissionsAry;
        console.log(this.route.snapshot.data.action);
        

        if (this.route.snapshot.data.action == "create") {

            this._roleService.save(model).subscribe((result) => {
                this._roleModel = result;
                this.showFlashAndRedirect("Data saved", "Role", result._id);
            }, error => {

            })
        }
        else if (this.route.snapshot.data.action == "update") {
            console.log(model);
            this._roleService.update(this._roleModel._id, model).subscribe((result) => {
                this.showFlashAndRedirect("Data saved", "Role", this._roleModel._id);
            }, error => {

            })

        }
    }

    deleteRecord(model: Role) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                //delete process
                this._roleService.delete(model._id).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['/settings/roles/']);
                    }
                }, error => {

                })
            }
        });

    }

    /**
     * On click of any checkbox (permission) push it into array so on save button we can submit it.
     * 
     * @param permission_id string
     */
    public pushPermission(permission_id: string) {

        let index = -1;

        _.each(this.rolePermissionsAry, (permissionObj, ind) => {
            if (permission_id == permissionObj.permission_id) {
                index = ind;
            }
        })

        if (index < 0) {
            this.rolePermissionsAry.push({ module_id: this.selectedModule, permission_id: permission_id });
        } else {
            this.rolePermissionsAry.splice(index, 1);
        }

    }

    /** ******************************************************************************************* */
    //TODO:low: move following error handling functions to some proper class.
    /**
     * Will redirect to role update page
     * @param message 
     * @param title 
     * @param id 
     */
    private showFlashAndRedirect(message: string, title: string, id: string) {
        this.snackBar.open(message, title, {
            duration: 2000,
        }).afterDismissed().subscribe(() => {
            //redirecting to user
            this.router.navigate(['/settings/roles/view', id]);
        });
    }
}