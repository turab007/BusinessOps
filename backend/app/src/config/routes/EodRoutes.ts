import * as express from "express";
import EodController = require("./../../controllers/EodController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");


class EodRoutes {
    private _eodController: EodController;

    constructor() {
        this._eodController = new EodController();
    }
    get routes() {
        var controller = this._eodController;

        router = SystemRouter.setParametersRouters("eod", controller, "ws", "EOD Reports");
        //custom routes
        router.route('/eod/search/:ws').get(controller.searchEOD)
        return router;
    }
}

Object.seal(EodRoutes);
export { EodRoutes };