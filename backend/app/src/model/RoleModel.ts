/// <reference path="../../_all.d.ts" />
import BaseModel = require("./base/BaseModel");
import RoleRepository = require("./../dal/repository/RoleRepository");
import IRoleModel = require("./interfaces/IRoleModel");
import { RolePermissionModel } from './barrel/';
import IRolePermissionModel = require("./interfaces/IRolePermissionModel");

/**
 * Role Model
 * 
 * @class RoleModel
 */
class RoleModel extends BaseModel<IRoleModel> {

    constructor() {
        super(new RoleRepository());
    }

    /**
     * Find Single Role with permissions if loadRolePermissions = 1.
     * 
     * TODO:low: loadRolePermissions is number base checking which is "WRONG"
     * 
     * @param _id string
     * @param loadRolePermissions number
     */
    findWithPermissions(_id, loadRolePermissions: number) {

        // Find Role
        return this.findById(_id).then(result => {

            if (loadRolePermissions == 1) {

                // Find permissions
                return new RolePermissionModel().find({ role_id: result._id }).then(rolePerResult => {

                    // Preapre array to send to frontend
                    let permissionsAry: any[] = [];

                    for (let index in rolePerResult) {
                        permissionsAry.push({ module_id: rolePerResult[index].module_id, permission_id: rolePerResult[index].permission_id });
                    }

                    // TODO:low:15May17: For now I am unable to map result to IRoleModel. It should be some kind of casting/maping like result = <IRoleModel>result instead of assigning the values manually in other variable.
                    let roleResult: IRoleModel = {
                        _id: result._id,
                        // module_id: result.module_id,
                        name: result.name,
                        description: result.description,
                        status: result.status,
                        permissions: permissionsAry
                    };

                    return roleResult;

                });
            }
            else {
                return result;
            }
        });
    }

    /**
     * Create Role with permissions. permissionsIds should contain array of permission ids i.e. [permission_id_1, permission_id_2, ..] 
     * 
     * @param item IRoleModel
     * @param permissionsIds any[]
     */
    createWithPermissions(item: IRoleModel, permissionsIds: any[]) {

        //TODO:high:15May17: validate Role should not exist twice in same module

        // Create New Role
        return this.create(item).then(result => {

            // If role is created
            if (result) {
                // Create all role-permissions availabe in permissionsIds (recursively)
                return new RolePermissionModel().createRolePermissions(result._id, permissionsIds).then(res => {
                    return result;
                });
            }
        });
    }

    /**
     * Update existing role with permissions.
     * This mehtod is responsible for updating role, creating new role permissions and delteing existed role permissions 
     * if not posted in permissionsIds.
     * 
     * @param _id string
     * @param item IRoleModel
     * @param permissionsIds any[]
     */
    updateWithPermissions(_id: string, item: IRoleModel, permissionsAry: any[]) {

        let rolePermModel = new RolePermissionModel();

        //TODO:high:15May17: validate Role should not exist twice in same module

        return this.update(_id, item).then(result => {

            // If role is updated
            if (result) {

                // Create role-permissions if not exist
                return rolePermModel.deleteRolePermissionsIfNotInAry(_id, permissionsAry)
                    .then(result => {
                        // Create all role-permissions availabe in permissionsIds (recursively)
                        return rolePermModel.createRolePermissions(_id, permissionsAry);
                    });
            }
        });
    }

    /**
     * Delete single role. To delte role we also have to delete associated chld documents. 
     * In this case of, "Role" has one child document/table "RolePermissions"
     * 
     * Note: Make sure that all child documents/tables are deleted befre delteing role record.
     * 
     * @param _id string
     */
    delete(_id: string) {

        // Delete Role Permissions

        return new RolePermissionModel().deleteAllByAttributes({ role_id: _id })
            .then(result => {
                if (result) {
                    // Delte Role
                    return super.delete(_id)
                }
            })

    }
}
Object.seal(RoleModel);
export {RoleModel };