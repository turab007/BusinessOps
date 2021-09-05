import * as express from "express";
import ListsController = require("./../../controllers/ListsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class ListRoutes
 */
class ListRoutes {
    private _listsController: ListsController;

    constructor() {
        this._listsController = new ListsController();
    }
    get routes() {
        var controller = this._listsController;
        router = SystemRouter.setParametersRouters("lists", controller, "ws", "Lists");
        //custom routes
        router.route("/lists/updateOrder/:ws/").put(controller.updateOrder);

        router.route(`/lists/copy/:ws/:_id`).post(controller.copy);
        router.route(`/lists/move/:ws/:_id`).put(controller.move);
        router.route(`/lists/share/:ws/:_id`).post(controller.share)



        return router;
    }
}

Object.seal(ListRoutes);
export { ListRoutes };