import * as express from "express";
import ReleasesController = require("./../../controllers/ReleasesController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class ReleaseRoutes
 */
class ReleaseRoutes {
    private _releasesController: ReleasesController;

    constructor() {
        this._releasesController = new ReleasesController();
    }
    get routes() {
        var controller = this._releasesController;

        router = SystemRouter.setRouters("releases",controller);
        
        return router;
    }
}

Object.seal(ReleaseRoutes);
export { ReleaseRoutes };