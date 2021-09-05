/// <reference path="../../_all.d.ts" />
import Promise = require("bluebird");
import IRolePermissionModel = require("./interfaces/IRolePermissionModel");
import RolePermissionRepository = require("./../dal/repository/RolePermissionRepository");
import { PermissionChildrenModel } from './barrel/';
import BaseModel = require("./base/BaseModel");
import { PermissionModel } from "./barrel/";
import _ = require('lodash-node');

/**
 * RolePermission Model
 * 
 * @class RolePermissionModel
 */
class RolePermissionModel extends BaseModel<IRolePermissionModel> {

    constructor() {
        super(new RolePermissionRepository());
    }

    find(cond) {
        return this._repo.find(cond);
    }

    /**
     * Create Role Permissions, this method is for creating new role permissions, and being called on creating new role.
     * Here we don't need to check if role permission already exists or not..
     * 
     * @param role_id string
     * @param permissionsAry any[]
     */
    createRolePermissions(role_id, permissionsAry) {

        // Read all role permissions
        return Promise.each(permissionsAry, (permissionObj) => {

            // Create Role Permissions Recursively
            return this.createRolePermissionRecursively(role_id, permissionObj.module_id, permissionObj.permission_id);
        })
    }

    /**
     * Create Role Permission Recursively.
     * 
     * Method is responsible for 
     *  1. Checking if role permission does not exists 
     *  2. create new role permission
     *  3. Find children permissions (in PermissionChildrenModel)
     *  4. Call itself Recursively to create role permission (child)
     * 
     * @param role_id string
     * @param module_id string
     * @param permission_id string
     */
    public createRolePermissionRecursively(role_id: string, module_id: string, permission_id: string) {

        // check if permission does not exist
        return this.findByAttribute({ role_id: role_id, permission_id: permission_id }).then(result => {

            if (!result) {
                let rolePermission: IRolePermissionModel = {
                    module_id: module_id,
                    role_id: role_id,
                    permission_id: permission_id
                }
                // Create Role Permission
                return this.create(rolePermission).then(rolePerResult => {

                    // Find its children
                    return new PermissionChildrenModel().findAllByAttributes({ parent_id: permission_id }).then(children => {

                        // Iterate through children
                        return Promise.each(children, (child) => {

                            // Create/Save child permission as well.
                            return this.createRolePermissionRecursively(role_id, module_id, child.child_id);
                        })
                    })
                });
            }
        })

    }

    /**
     * Delete All role permissions which are not available in permissionsIds array. "permissionsIds" is being posted from frontentd
     * 
     * @param role_id string
     * @param permissionsAry any[]
     */
    deleteRolePermissionsIfNotInAry(role_id: string, permissionsAry: any[]) {

        //TODO:low: For now, deleting all role permissions and after that re-inserting all posted permissions
        // Because of time-shortage issue to implement it.
        // Actuall Process should be
        // Delete permission if not posted after checking this
        //      If that permission has any child delete it 
        //          If that child does not belongs to any other permission in this role.
        return this.deleteAllByAttributes({ role_id: role_id });

        // Find all saved role permission of role_id
        // return this.find({ role_id: role_id }).then(savedRolePermissions => {

        //     // If we found any role permission
        //     if (savedRolePermissions.length > 0) {

        //         // Then iterate through each role permission
        //         return Promise.each(savedRolePermissions, (rolePermission) => {

        //             // To check if it (saved) is not available in posted array (permissionsIds)
        //             let deletIt: boolean = true;

        //             // Check if it (saved) is not available in posted array (permissionsIds)
        //             for (let index = 0; index < permissionsAry.length; index++) {

        //                 if (permissionsAry[index].permission_id == rolePermission.permission_id) {
        //                     deletIt = false;
        //                 }
        //             }

        //             // TODO:low:15May17: There should be one delte query instead of multiple via looping
        //             // if not found then delete it.
        //             if (deletIt == true) {
        //                 return new RolePermissionModel().delete(rolePermission._id.toString());
        //             }

        //         })
        //     }
        //     // If not found anything return.
        //     return savedRolePermissions;
        // })
    }


    deleteRolePermission(roleId, permId) {
        return this.deleteAllByAttributes({ role_id: roleId,permission_id:permId });

    }

    /**
     * This method is responsible for finding (single) permission from provided array of roles and returning boolean true/false.
     * 
     * use: checkRolesHasPermission([role_pk_1, role_pk_2], permission_pk)
     * 
     * @param roleIds any[]
     * @param permisison_id string
     */
    checkRolesHavePermission(roleIds, permisison_id) {

        // Prepare condition
        let cond = {
            role_id: { $in: roleIds },
            permission_id: permisison_id
        }

        return new RolePermissionModel().find(cond).then(rpResult => {

            if (rpResult.length > 0) {
                return true
            }
            else {
                return false;
            }
        })
    }

    /**
     * This method is responsible for finding all permissions on the bases of provieded roles array.
     * 
     * @param roleIds any[]
     */
    public getRolesPermissions(roleIds: any[]) {

        console.log('===============role permissions==============', roleIds);

        // Prepare condition
        let cond = { role_id: { $in: roleIds } }

        return this.find(cond);
    }

    public getPermissions(roleIds: any[]) {
        return new RolePermissionModel().getRolesPermissions(roleIds).then(rolePermissions => {

            let cond = { _id: { $in: _.map(rolePermissions, 'permission_id') } }

            return new PermissionModel().find(cond).then(permissions => {

                return permissions; //REMOVE IF TO SEND PERMISSIONS AFTER MAPPING

                // Prepare array i.e. ['controller1.action1', 'controller2.action2']
                // return _.map(permissions, (permission) => {
                //     return permission.controller + "." + permission.action;
                // })
            })

        })

    }



}
Object.seal(RolePermissionModel);
export { RolePermissionModel };