import UserModel = require("./../model/UserModel");
import { UserRoleModel, PermissionModel, RolePermissionModel,RoleWorkspacePermission } from "./../model/barrel/";


/**
 * Role Base Access Control Model
 * 
 * TODO:low:16May17: for now RBAC is not checking module while checking permission of role.
 * 
 * @class RBACModel
 */
class RBACModel {

    constructor() {
    }

    /**
     * Check if User has permission or not.
     * 
     * @param user_id string (user email or login id not primary key)
     * @param controller string
     * @param action string
     */
    checkPermission(user_id, controller, action) {

        return new UserModel().findByAttribute({ 'user_id': user_id }).then((result) => {

            if (result) {
                // If user is super user then he can do ANYTHING :D
                if (result.is_admin === true) {
                    return true;
                }
                else {

                    return this.findPermission(result._id, controller, action);
                }
            }
        })
    }

    /**
     * This method is responsible for finding if user has permision or not on the bases of assigned roles.
     * 
     * @param user_id string (primary key of user record)
     * @param controller string
     * @param action string
     * @return boolean
     */
    findPermission(user_id, controller, action) {

        return new PermissionModel().findByAttribute({ controller: controller, action: action }).then(permissionRes => {
            console.log('========these are app permissions===============', permissionRes, controller, action);
            if (permissionRes) {

                return new UserRoleModel().getUserRolesIdsArray(user_id).then(roleIds => {

                    return new RolePermissionModel().checkRolesHavePermission(roleIds, permissionRes._id);
                })
            }

        })
    }


    /**
     * GETS USER AND PASSES IT TO findWsPermissions() TO GET PERMISSIONS
     * @param user_id  ID OF USER TO CHECK PERMISSION
     * @param controller CONTROLLER IN WHICH TO CHECK PERMISSION
     * @param action ACTION TO BE PERFORMED INSIDE CONTROLLER
     * @param module_id MODULE OF THE PERMISSION (E.G WORKSPACE)
     * @param role ROLE OF THE USER IN THE WORKSPACE
     */
    checkWsPermission(user_id, controller, action, module_id, role,wsID) {
        //GET USER
        console.log("Inside checkPermissionWS");
        return new UserModel().findByAttribute({ 'user_id': user_id }).then(result => {
            // console.log('============this is the user==========',result);
            console.log('i am sending this role', role);
            return this.findWsPermissions(user_id, controller, action, module_id, role,wsID)
        })

    }

    /**
     * GETS ALL PERMISSIONS AND CHECK IF USER ROLE HAS PERMISSION
     * @param user_id ID OF USER TO CHECK PERMISSION
     * @param controller CONTROLLER IN WHICH TO CHECK PERMISSION
     * @param action ACTION TO BE PERFORMED INSIDE CONTROLLER
     * @param module_id MODULE OF THE PERMISSION (E.G WORKSPACE)
     * @param role ROLE OF THE USER IN THE WORKSPACE
     */

    findWsPermissions(user_id, controller, action, module_id, role,wsID) {

        //GET PERMISSION OF CURRENT CONTROOLER,ACTION AND MODULE
        return new PermissionModel().findByAttribute({ controller: controller, action: action, module_id: module_id }).then(permissionRes => {
            console.log('========these are permissions===============', permissionRes, role, controller, action, module_id);

            if (permissionRes) {

                //CHECK IF ABOVE PERMISSIONS ARE OF CURRENT ROLE
                return new RoleWorkspacePermission().checkRolesHavePermission([role], permissionRes._id,wsID).then(result => {
                    console.log('==============result=============', result);
                    return result;
                });

            }

        })

    }

}
Object.seal(RBACModel);
export { RBACModel };