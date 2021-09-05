import * as express from "express";
import WorkSpaceController = require("./../../controllers/WorkSpaceController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class WorkSpaceRoutes
 */
class WorkSpaceRoutes {
    private _workSpaceController: WorkSpaceController;

    constructor() {
        this._workSpaceController = new WorkSpaceController();
    }
    get routes() {
        var controller = this._workSpaceController;
        router = SystemRouter.setRouters("workSpaces", controller);
        //custom routes
        router.route("/workSpaces/getNotPersonal").get(controller.getNotPersonal);
        router.route("/workSpaces/addWorkSpace/:_id").put(controller.addWorkSpace);
        router.route("/workSpaces/addApplet/:_id/:_appletId").put(controller.addApplet);
        router.route("/workSpaces/removeApplet/:_id/:_appletId").delete(controller.removeApplet);
        // router.route("/workSpaces/settings/:_id").get(controller.getWorkspaceUsers)
        router.route("/workSpaces/addUser/:_id").put(controller.addWorkspaceUser);
        router.route("/workSpaces/getUsers/:_id").get(controller.getWorkspaceUser);
        router.route("/workSpaces/removeUser/:_id/:_userId").delete(controller.deleteWorkspaceUser);

        router.route("/workSpaces/updateRole/:_id/:_userId").put(controller.updateUser);


        return router;
    }
}

Object.seal(WorkSpaceRoutes);
export { WorkSpaceRoutes };