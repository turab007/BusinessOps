import * as express from "express";
import RolePermissionsController = require("./../../controllers/RolePermissionsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");
/**
 * @class RolePermissionRoutes
 */
class RolePermissionRoutes {
    private _RolePermissionsController: RolePermissionsController;

    constructor() {
        this._RolePermissionsController = new RolePermissionsController();
    }
    get routes() {
        var controller = this._RolePermissionsController;

        router = SystemRouter.setRouters("rolepermissions", controller);
        router.route("/rolepermissions/getPermissions/:_id/").get(controller.getPermissions);
        router.route("/rolepermissions/removePermission/").put(controller.unassignPermission);

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

Object.seal(RolePermissionRoutes);
export { RolePermissionRoutes };