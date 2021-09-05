import * as express from "express";
import PermissionsController = require("./../../controllers/PermissionsController");
var router = express.Router();

/**
 * @class PermissionRoutes
 */
class PermissionRoutes {
    private _PermissionsController: PermissionsController;

    constructor() {
        this._PermissionsController = new PermissionsController();
    }
    get routes() {
        var controller = this._PermissionsController;

        router.route("/permissions/view/:_id").get(controller.view);
        router.route("/permissions/findByModule/:module_id").get(controller.findByModule);
        router.route("/permissions/index").get(controller.index);
        router.route("/permissions/create").post(controller.create);
        router.route("/permissions/update/:_id").get(controller.update);
        router.route("/permissions/delete/:_id").get(controller.delete);

        return router;
    }


}

Object.seal(PermissionRoutes);
export { PermissionRoutes };