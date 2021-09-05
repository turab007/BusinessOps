import * as express from "express";
import CompaniesController = require("./../../controllers/CompaniesController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

/**
 * @class CompanyRoutes
 */
class CompanyRoutes {
    private _companiesController: CompaniesController;

    constructor() {
        this._companiesController = new CompaniesController();
    }
    get routes() {
        var controller = this._companiesController;

        router = SystemRouter.setRouters("companies",controller);          
        return router;
    }
}

Object.seal(CompanyRoutes);
export { CompanyRoutes };