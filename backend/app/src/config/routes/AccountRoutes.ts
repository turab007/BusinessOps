import * as express from "express";
import AccountsController = require("./../../controllers/AccountsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class AccountRoutes
 */
class AccountRoutes {
    private _AccountsController: AccountsController;

    constructor() {
        this._AccountsController = new AccountsController();
    }
    get routes() {
        var controller = this._AccountsController;

        router = SystemRouter.setRouters("accounts", controller);
        //custom routes
        router.route("/accounts/technologies").get(controller.getTechnologies);
        router.route("/accounts/timeZones").get(controller.getTimeZones);
        router.route("/accounts/viewTimeZone/:_id").get(controller.viewTimeZone);
        router.route("/accounts/viewBusinessGroupsByCurrentUser").get(controller.getBusinessGroupsByCurrentUser);
        router.route("/accounts/viewAccountsGroupGroupByStatus").get(controller.getAccountsGroupByStatusByCurrentBusinessGroup);

        return router;
    }
}

Object.seal(AccountRoutes);
export { AccountRoutes };