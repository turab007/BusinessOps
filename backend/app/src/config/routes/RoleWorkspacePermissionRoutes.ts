import * as express from "express";
import RoleWorkspacePermissionController = require("./../../controllers/RoleWorkspacePermissionController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");
/**
 * @class RolePermissionRoutes
 */
class RoleWorkspacePermissionRoutes {
    private _RoleWorkspacePermissionsController: RoleWorkspacePermissionController;

    constructor() {
        this._RoleWorkspacePermissionsController = new RoleWorkspacePermissionController();
    }
    get routes() {
        var controller = this._RoleWorkspacePermissionsController;

        // router = SystemRouter.setRouters("rolewspermissions", controller);
        router.route("/rolewspermissions/getPermissions/:ws/:_id/").get(controller.getPermissions);
        router.route("/rolewspermissions/create/:ws/").post(controller.create);
        router.route("/rolewspermissions/removePermission/:ws/").put(controller.unassignPermission);

        // router.route("/rolepermissions")
        //     .get(controller.index)
        //     .post(controller.create);

        // router.route("/rolepermissions/:_id")
        //     .get(controller.view)
        //     .delete(controller.delete)
        //     .put(controller.update);

        return router;
    }


}

Object.seal(RoleWorkspacePermissionRoutes);
export { RoleWorkspacePermissionRoutes };