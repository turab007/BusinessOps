import * as express from "express";
import AppletsController = require("./../../controllers/AppletsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class AppletRoutes
 */
class AppletRoutes {
    private _AppletsController: AppletsController;

    constructor() {
        this._AppletsController = new AppletsController();
    }
    get routes() {
        var controller = this._AppletsController;
        router = SystemRouter.setRouters("applets", controller);

        return router;
    }


}

Object.seal(AppletRoutes);
export { AppletRoutes };