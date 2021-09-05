import * as express from "express";
import StatusFlowsController = require("./../../controllers/StatusFlowsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class StatusFlowRoutes
 */
class StatusFlowRoutes {
    private _statusFLowController: StatusFlowsController;

    constructor() {
        this._statusFLowController = new StatusFlowsController();
    }
    get routes() {
        var controller = this._statusFLowController;
        router = SystemRouter.setRouters("statusFlows",controller);          

        return router;
    }
}

Object.seal(StatusFlowRoutes);
export { StatusFlowRoutes };