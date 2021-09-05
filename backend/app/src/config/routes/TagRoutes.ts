import * as express from "express";
import TagsController = require("./../../controllers/TagsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class TagRoutes
 */
class TagRoutes {
    private _tagsController: TagsController;

    constructor() {
        this._tagsController = new TagsController();
    }
    get routes() {
        var controller = this._tagsController;

        router = SystemRouter.setRouters("tags",controller);          
        //custom routes
        router.route("/tags/types").get(controller.getTypes);  

        return router;
    }
}

Object.seal(TagRoutes);
export { TagRoutes };