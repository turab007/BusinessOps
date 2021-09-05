import { Component, EventEmitter, Input, Output } from '@angular/core';
import _ from "lodash-node";
import { PermissionService, ModulePermission } from '../../../../'

@Component({
    selector: 'permissions-form',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.css'],
    providers: [PermissionService]
})
export class PermissionsComponent {

    public disabled: boolean = true;

    /**
     * Input string (from parent) contains the _id of selected module.
     */
    @Input('selectedModule') selectedModule: string;

    /**
     * Role permission array contains the permissions which is assigned or beign assign to role.
     * This array wil contain olny Ids (_ids) of permissions and will save in RolePermission
     */
    @Input('rolePermissionsAry') rolePermissionsAry: any[];

    /**
     * What is page action. create/update or view
     */
    @Input('pageAction') pageAction: string;

    /**
     * Event Emitter to emit (selected) permissions to parent component.
     * In this class permissions are being pushed in array rolePermissionsAry and then being emitted to parent component.
     */
    @Output() pushPermission = new EventEmitter<any[]>();

    /**
     * modulePermissions array will contain the json objects with {_id, title, children} data
     */
    public modulePermissions: ModulePermission[];
    public modulePermissionChildren: ModulePermission[];

    constructor(private _permissionService: PermissionService) { }

    ngOnInit() {

        this._loadPermissions(this.selectedModule);

        this.disabled = (this.pageAction == "view") ? true : false;

    }

    /**
    * Load Permissions of selected module from backend via service.
    *
    * @param module_id string
    */
    private _loadPermissions(module_id: string) {
        this._permissionService.findByModule(module_id).subscribe((result) => {
            if (result) {
                this.modulePermissions = result;

                if (this.modulePermissions.length) {
                    this.loadControllerActions(this.modulePermissions[0]._id);
                }
            }
        }, error => {
            console.log(error);
        });
    }

    /**
     * load Controller Actions (permissions) on click of controller.
     * 
     * This function is responsible for loading/assigning (in/to modulePermissionChildren) all permissions 
     * belongs to (clicked) Controller.*
     * 
     * @param _id string
     */
    loadControllerActions(_id: string) {
        
        let controllerPermissionsList = [];
        _.each(this.modulePermissions, function (obj) {

            if (obj._id == _id) {
                controllerPermissionsList = obj.permissions;
            }

        }, this);

        this.setPermissionCheckedStatus(controllerPermissionsList)

    }

    /**
     * Set (Controller) Permission checked status true if it is saved in database.
     * 
     * This method is checking if id of provided array (controllerPermissionsList) exists in this.rolePermissionsAry array then cehced it true.
     * 
     * @param controllerPermissionsList any[]
     */
    private setPermissionCheckedStatus(controllerPermissionsList) {

        if (this.rolePermissionsAry.length) {

            let controllerPermissionsList_Temp = [];

            _.each(controllerPermissionsList, (permission) => {

                permission['isAssigned'] = (this.rolePermissionsAry.indexOf(permission._id) >= 0 ? true : false);
                
                controllerPermissionsList_Temp.push(permission);

            });

            this.modulePermissionChildren = controllerPermissionsList_Temp;

        } else {

            this.modulePermissionChildren = controllerPermissionsList;

        }
    }

    /**
     * Emit Permission to parent component. (role-form.component)
     * 
     * @param _id string
     */
    emitPermission(_id: string) {

        // User findIndex
        let index = this.rolePermissionsAry.indexOf(_id);

        if (index < 0) {
            this.rolePermissionsAry.push(_id);
        } else {
            this.rolePermissionsAry.splice(index, 1);
        }

        console.log('here');
        this.setPermissionCheckedStatus(this.modulePermissionChildren);

        this.pushPermission.emit(this.rolePermissionsAry);
    }


    // /**
    //  * When Permissions (sub page controller.*) is switched and on reloading the same controller.* save the selected permissions
    //  * 
    //  * TODO:low:13May17: (will create proformance issue) This method is being calld too many times (automatically) and it is for just displaying the checked or uncheckd and keep the status when user navigate to other controlelr(submenu).
    //  * @param _id string
    //  */
    // isPerEnabled(_id: string) {
    //     console.log('repeat');
    //     let index = this.rolePermissionsAry.indexOf(_id);

    //     if (index < 0) {
    //         return false;
    //     }
    //     else {
    //         return true;
    //     }
    // }

    // /**
    //  * On loading page disable the checkboxes if they are in view mode.
    //  * 
    //  * TODO:low:13May17: (will create proformance issue) This method is being calld too many times (automatically) and it is for just displaying the checked or uncheckd and keep the status when user navigate to other controlelr(submenu).
    //  */
    // isDisabled() {
    //     if (this.pageAction == "view") {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
}