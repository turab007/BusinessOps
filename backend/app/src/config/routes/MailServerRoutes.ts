import * as express from "express";
import MailServersController = require("./../../controllers/MailServersController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class MailServerRoutes
 */
class MailServerRoutes {
    private _mailServerController: MailServersController;

    constructor() {
        this._mailServerController = new MailServersController();
    }
    get routes() {
        var controller = this._mailServerController;
        router = SystemRouter.setRouters("mailServers",controller);    
        //custom routes
        router.route("/mailServers/test").post(controller.test);      

        return router;
    }
}

Object.seal(MailServerRoutes);
export { MailServerRoutes };