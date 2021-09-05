import * as express from "express";
import LoginController = require("./../../controllers/LoginController");

var router = express.Router();
/**
 * @class LoginRoutes
 */
class LoginRoutes {
    private _LoginController: LoginController;

    constructor() {
        this._LoginController = new LoginController();
    }
    get routes() {
        var controller = this._LoginController;

        router.route("/login")
            .post(controller.login)
        //TODO:Low (In future we will make a new controller for user confirmation and reset password tasks)    
        router.route("/verification")
            .post(controller.verifyTokenAndActivateUser)
        router.route("/forgot-password")
            .post(controller.forgotPassword)
        router.route("/reset-password")
            .post(controller.resetPassword)
        router.route("/verify-reset-password")
            .post(controller.verifyResetToken)

        router.route("/logout")
            .delete(controller.logout)

        return router;
    }


}

Object.seal(LoginRoutes);
export { LoginRoutes };