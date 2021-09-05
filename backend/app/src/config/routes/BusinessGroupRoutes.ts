import * as express from "express";
import BusinessGroupsController = require("./../../controllers/BusinessGroupsController");
var router = express.Router();

/**
 * @class BusinessGroupRoutes
 */
class BusinessGroupRoutes {
    private _BusinessGroupsController: BusinessGroupsController;

    constructor() {
        this._BusinessGroupsController = new BusinessGroupsController();
    }
    get routes() {
        var controller = this._BusinessGroupsController;

        router.route("/businessGroups/index").get(controller.index);
        router.route("/businessGroups/view/:_id").get(controller.view);
        router.route("/businessGroups/create").post(controller.create);
        router.route("/businessGroups/update/:_id").put(controller.update);
        router.route("/businessGroups/delete/:_id").delete(controller.delete);

        return router;
    }
}

Object.seal(BusinessGroupRoutes);
export { BusinessGroupRoutes };