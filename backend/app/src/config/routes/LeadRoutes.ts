import * as express from "express";
import LeadsController = require("./../../controllers/LeadsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class LeadRoutes
 */
class LeadRoutes {
    private _LeadsController: LeadsController;

    constructor() {
        this._LeadsController = new LeadsController();
    }
    get routes() {
        var controller = this._LeadsController;

        router = SystemRouter.setRouters("leads", controller);
        //custom routes
        router.route("/leads/technologies").get(controller.getTechnologies);
        router.route("/leads/timeZones").get(controller.getTimeZones);
        router.route("/leads/viewTimeZone/:_id").get(controller.viewTimeZone);
        router.route("/leads/viewBusinessGroupsByCurrentUser").get(controller.getBusinessGroupsByCurrentUser);
        router.route("/leads/viewLeadsGroupGroupByStatus").get(controller.getLeadsGroupByStatusByCurrentBusinessGroup);

        return router;
    }
}

Object.seal(LeadRoutes);
export { LeadRoutes };