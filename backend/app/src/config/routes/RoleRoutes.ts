import * as express from "express";
import RolesController = require("./../../controllers/RolesController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");
/**
 * @class RoleRoutes
 */
class RoleRoutes {
    private _RolesController: RolesController;

    constructor() {
        this._RolesController = new RolesController();
    }
    get routes() {
        var controller = this._RolesController;

        router = SystemRouter.setRouters("roles", controller);
        router.route("/roles/view/:_id/:getPermissions").get(controller.view);
        router.route("/roles/getModules").get(controller.getModules);

        return router;
    }


}

Object.seal(RoleRoutes);
export { RoleRoutes };