import { _ } from 'lodash-node';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CovalentChipsModule } from '@covalent/core';

import { RoleService, Role } from './../../../../';

@Component({
    selector: 'user-roles-component',
    templateUrl: 'user-roles.component.html',
    styleUrls: ['user-roles.component.css'],
    providers: [RoleService]
})
export class UserRolesComponent {

    /**
     * Get page action (view or else) from parent component for enabling/disabling form components (checkboxes)
     */
    @Input('pageAction') pageAction: string;

    /**
     * To deisable/enable fields (checkboxes)
     */
    public readOnly: boolean;


    /**
     * Push role to parent component
     */
    @Output() pushRole = new EventEmitter<any[]>();

    /**
     * Get json array of roles assigned to users from parent component
     */
    @Input('userRoles') userRoles: any[];

    /**
     * Json Aray of modules
     */
    public roles: Role[];
    public rolesNames: string[];
    public userRolesNames: string[] = [];

    /**
     * @constructor
     * @param _roleService RoleService
     */
    constructor(private _roleService: RoleService) { }


    /**
     * On Init
     */
    ngOnInit() {

        this.readOnly = (this.pageAction == "view") ? true : false;

        this._getModulesWithRoles();

    }

    /**
     * Get json array of modules with roles.
     */
    private _getModulesWithRoles() {

        this._roleService.index().subscribe((result) => {

            if (result) {
                this.roles = result;
                this.rolesNames = _.map(result, 'name');

                this.userRolesNames = [];
                
                _.each(this.roles, role => {
                    if (this.userRoles.indexOf(role._id) >= 0) {
                        this.userRolesNames.push(role.name);
                    }
                })

                console.log(this.rolesNames);

                this.setRoleCheckedStatus();
            }

        }, error => {
            console.log(error);
        });
    }

    /**
     * Set Role Checkd status to true or fallse
     * check if role is assigned to user then set isAsigned to true
     * 
     */
    private setRoleCheckedStatus() {

        _.each(this.roles, role => {
            if (this.userRoles.indexOf(role._id) >= 0) {
                role['checked'] = true;
            }
        })
    }

    /**
     * Prepare userRoleObj [role_id, user_id] after checking if it is not already existed in this.userRoles array.
     * If it already existed then remove it from array. (Rmove it if checkbox is uncheckd on click)
     * 
     * @param module_id string
     * @param role_id string
     */
    emitRole() {
        
        this.userRoles = [];

        _.each(this.userRolesNames, roleName => {
            _.each(this.roles, role => {
                if(role.name == roleName){
                    this.userRoles.push(role._id);
                }
            })
        })

        this.pushRole.emit(this.userRoles);

        // let index = this.userRoles.indexOf(role_id);

        // if (index < 0) {
        //     this.userRoles.push(role_id);
        // } else {
        //     this.userRoles.splice(index, 1);
        // }

        // this.pushRole.emit(this.userRoles);
    }
}