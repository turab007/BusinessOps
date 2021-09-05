import * as express from "express";
import ActivityLogController = require("./../../controllers/ActivityLogController");
var router = express.Router();

/**
 * @class ActivityLogRoutes
 */
class ActivityLogRoutes {
    private _activityLogController: ActivityLogController;

    constructor() {
        this._activityLogController = new ActivityLogController();
    }
    get routes() {
        var controller = this._activityLogController;

        //custom routes
        router.route("/activity/index").get(controller.index);
        router.route("/activity/:_model/:wsId/:_id").get(controller.getLog);

        return router;
    }
}

Object.seal(ActivityLogRoutes);
export { ActivityLogRoutes };