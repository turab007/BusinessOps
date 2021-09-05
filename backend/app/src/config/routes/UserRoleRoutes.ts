import * as express from "express";
import UserRolesController = require("./../../controllers/UserRolesController");
var router = express.Router();

/**
 * @class UserRoleRoutes
 */
class UserRoleRoutes {
    private _UserRolesController: UserRolesController;

    constructor() {
        this._UserRolesController = new UserRolesController();
    }
    get routes() {
        var controller = this._UserRolesController;

        router.route("/user-roles/view/:_id").get(controller.view);
        router.route("/user-roles/index").get(controller.index);
        router.route("/user-roles/create").post(controller.create);
        router.route("/user-roles/update/:_id").put(controller.update);
        router.route("/user-roles/delete/:_id").delete(controller.delete);

        // router.route("/userroles")
        //     .get(controller.index)
        //     .post(controller.create);

        // router.route("/userroles/:_id")
        //     .get(controller.view)
        //     .delete(controller.delete)
        //     .put(controller.update);

        return router;
    }


}

Object.seal(UserRoleRoutes);
export { UserRoleRoutes };