import * as express from "express";
import OpportunitiesController = require("./../../controllers/OpportunitiesController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class OpportunityRoutes
 */
class OpportunityRoutes {
    private _OpportunitiesController: OpportunitiesController;

    constructor() {
        this._OpportunitiesController = new OpportunitiesController();
    }
    get routes() {
        var controller = this._OpportunitiesController;

        router = SystemRouter.setRouters("opportunities", controller);
        //custom routes
        router.route("/opportunities/technologies").get(controller.getTechnologies);
        router.route("/opportunities/timeZones").get(controller.getTimeZones);
        router.route("/opportunities/viewTimeZone/:_id").get(controller.viewTimeZone);
        router.route("/opportunities/viewBusinessGroupsByCurrentUser").get(controller.getBusinessGroupsByCurrentUser);
        router.route("/opportunities/viewOpportunitiesGroupGroupByStatus").get(controller.getOpportunityiesGroupByStatusByCurrentBusinessGroup);

        return router;
    }
}

Object.seal(OpportunityRoutes);
export { OpportunityRoutes };