import * as express from "express";
import TaskGroupsController = require("./../../controllers/TaskGroupsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class TaskGroupRoutes
 */
class TaskGroupRoutes {
    private _taskGroupsController: TaskGroupsController;

    constructor() {
        this._taskGroupsController = new TaskGroupsController();
    }
    get routes() {
        var controller = this._taskGroupsController;
        router = SystemRouter.setParametersRouters("taskGroups", controller, "ws", "Tasks");
        //custom routes
        router.route("/taskGroups/updateOrder/:ws/").put(controller.updateOrder);      
        

        return router;
    }
}

Object.seal(TaskGroupRoutes);
export { TaskGroupRoutes };