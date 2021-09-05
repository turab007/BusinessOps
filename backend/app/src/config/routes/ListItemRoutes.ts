import * as express from "express";
import ListItemsController = require("./../../controllers/ListItemsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class ListItemRoutes
 */
class ListItemRoutes {
    private _listItemsController: ListItemsController;

    constructor() {
        this._listItemsController = new ListItemsController();
    }
    get routes() {
        var controller = this._listItemsController;
        router = SystemRouter.setParametersRouters("listItems",controller,"list");      

        //custom routes
        router.route("/listItems/index/:ws/:list/").get(controller.index);          
        router.route("/listItems/view/:ws/:list/:_id").get(controller.view);          
        router.route("/listItems/create/:ws/:list/").post(controller.create);          
        router.route("/listItems/update/:ws/:list/:_id").put(controller.update);          
        router.route("/listItems/delete/:ws/:list/:_id").delete(controller.delete);          
        router.route("/listItems/updateOrder/:ws/:list/").put(controller.updateOrder);          
        // router.route("/listItems/updateOrder/:ws/:list/").put(controller.updateOrder);          

        return router;
    }
}

Object.seal(ListItemRoutes);
export { ListItemRoutes };