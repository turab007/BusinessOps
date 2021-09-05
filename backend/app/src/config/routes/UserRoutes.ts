import * as express from "express";
import UsersController = require("./../../controllers/UsersController");

var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");
/**
 * @class UserRoutes
 */
class UserRoutes {
    private _UsersController: UsersController;

    constructor() {
        this._UsersController = new UsersController();
    }
    get routes() {
        var controller = this._UsersController;

        router = SystemRouter.setRouters("users", controller);

        router.route("/users/auto-complete/").post(controller.autoComplete).get(controller.autoComplete);
        router.route("/users/selected/").post(controller.getSelectedUsers).get(controller.getSelectedUsers);
        router.route("/users/getusers").get(controller.getUsers)
        router.route("/users/logged/").get(controller.getLoggedInUser);
        router.route("/users/authenticategithub/").post(controller.authenticateGitHub);
        router.route("/users/authenticategitlab/").post(controller.authenticateGitLab);


        //Todo:(low) development purpose    
        router.route("/users/viewBy/:attr/:attr_value/:id?").get(controller.view_by_attribute)

        return router;
    }


}

Object.seal(UserRoutes);
export { UserRoutes };