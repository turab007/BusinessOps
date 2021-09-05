import * as express from "express";
import ModulesController = require("./../../controllers/ModulesController");
var router = express.Router();

/**
 * @class ModuleRoutes
 */
class ModuleRoutes {
    private _ModulesController: ModulesController;

    constructor() {
        this._ModulesController = new ModulesController();
    }
    get routes() {
        var controller = this._ModulesController;

        router.route("/modules/view/:_id").get(controller.view);
        router.route("/modules/index/:withRoles").get(controller.index);
        router.route("/modules/create").post(controller.create);
        router.route("/modules/update/:_id").get(controller.update);
        router.route("/modules/delete/:_id").get(controller.delete);

        return router;
    }


}

Object.seal(ModuleRoutes);
export { ModuleRoutes };