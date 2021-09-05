import * as express from "express";
import ProfileController = require("./../../controllers/ProfileController");

var router = express.Router();
/**
 * @class ProfileRoutes
 */
class ProfileRoutes {
    private _ProfileController: ProfileController;

    constructor() {
        this._ProfileController = new ProfileController();
    }
    get routes() {
        var controller = this._ProfileController;

        router.route("/profile/change-password").post(controller.changePassword);
        router.route("/profile/view").get(controller.view);
        router.route("/profile/update").post(controller.update);
        router.route("/profile/currentWorkSpaces/").post(controller.getPersonalWorkSpaces).get(controller.getPersonalWorkSpaces);
        router.route("/profile/getAppletCount/").get(controller.getAppletCount)


        return router;
    }


}

Object.seal(ProfileRoutes);
export { ProfileRoutes };