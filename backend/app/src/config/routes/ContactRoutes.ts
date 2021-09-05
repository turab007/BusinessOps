import * as express from "express";
import ContactsController = require("./../../controllers/ContactsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class ContactRoutes
 */
class ContactRoutes {
    private _contactsController: ContactsController;

    constructor() {
        this._contactsController = new ContactsController();
    }
    get routes() {
        var controller = this._contactsController;

        router = SystemRouter.setRouters("contacts",controller);          
        return router;
    }
}

Object.seal(ContactRoutes);
export { ContactRoutes };