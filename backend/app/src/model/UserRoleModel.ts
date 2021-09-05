/// <reference path="../../_all.d.ts" />
import Promise = require('bluebird');
import _ = require('lodash-node');
import UserRoleRepository = require("./../dal/repository/UserRoleRepository");
import IUserRoleModel = require("./interfaces/IUserRoleModel");
import BaseModel = require("./base/BaseModel");
import { RolePermissionModel, PermissionModel } from "./barrel/";
/**
 * UserRole Model
 * 
 * @class UserRoleModel
 */
class UserRoleModel extends BaseModel<IUserRoleModel> {

    constructor() {
        super(new UserRoleRepository());
    }

    /**
     * Crate UserRoles on the bases of provided roles array, which should contain role_id
     * 
     * @param user_id string
     * @param rolesIds any[]
     */
    public createUserRoles(user_id: string, rolesIds: any[]) {

        return Promise.each(rolesIds, (role_id) => {
            // Check user role does not exist already
            return this.findByAttribute({ user_id: user_id, role_id: role_id }).then(savedUserRole => {

                if (!savedUserRole) {
                    // create new user role
                    let userRole: IUserRoleModel = {
                        user_id: user_id,
                        role_id: role_id
                    }
                    return this.create(userRole);
                }
            });
        });
    }

    /**
     * Delete all saved user-roles which are not available in (submitted/provided) roles array.
     * 
     * @param user_id string
     * @param rolesIds any[]
     */
    public deleteUserRolesIfNotInAry(user_id: string, rolesIds: any[]) {

        // Find all saved user-role of user_id
        return this.findAllByAttributes({ user_id: user_id }).then(userRolesList => {

            // If we found any user-role
            if (userRolesList.length > 0) {

                // Then iterate through each userRolesList
                return Promise.each(userRolesList, (userRole) => {

                    // To check if it (saved) is not available in posted array (roles)
                    let deletIt: boolean = true;

                    // Check if it (saved) is not available in posted array (roles)
                    for (let index = 0; index < rolesIds.length; index++) {

                        if (userRole.role_id == rolesIds[index]) {
                            deletIt = false;
                        }
                    }

                    // TODO:low:15May17: There should be one delte query instead of multiple via looping
                    // if not found then delete it.
                    if (deletIt == true) {
                        return this.delete(userRole._id.toString());
                    }

                })
            }
            // If not found anything return.
            return userRolesList;
        })
    }

    /**
     * This method is responisible for fetching all permissions of roles, which are assigned to user, 
     * and prepare/return an array of permissions 
     * 
     * @param user_id string primary key of user record
     */
    public getUserRolePermissions(user_id: string) {

        // Get users assigned roles array.
        return this.getUserRolesIdsArray(user_id).then(roleIds => {

            // Get permissions array.
            return new RolePermissionModel().getRolesPermissions(roleIds).then(rolePermissions => {

                let cond = { _id: { $in: _.map(rolePermissions, 'permission_id') } }

                return new PermissionModel().find(cond).then(permissions => {

                    // Prepare array i.e. ['controller1.action1', 'controller2.action2']
                    return _.map(permissions, (permission) => {
                        return permission.controller + "." + permission.action;
                    })
                })

            })
        })
    }


    /**
     * This method is responsible for getting user roles and converting their ids (primary keys) into array and returning it.
     * 
     * @param user_id string (user primary key)
     * @return any[]
     */
    public getUserRolesIdsArray(user_id: string) {

        return new UserRoleModel().findAllByAttributes({ user_id: user_id }).then(userRolesList => {

            if (userRolesList.length > 0) {

                return _.map(userRolesList, 'role_id');
            }
        })
    }


}

Object.seal(UserRoleModel);
export { UserRoleModel };