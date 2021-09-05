import * as express from "express";
import EmployeeController = require("./../../controllers/EmployeeController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");


class EmployeeRoutes {
    private _employeeController: EmployeeController;

    constructor() {
        this._employeeController = new EmployeeController();
    }
    get routes() {
        var controller = this._employeeController;

        router = SystemRouter.setRouters("employee", controller);
        //custom routes
        // router.route('/eod/search/:ws').get(controller.searchEOD)
        router.route('/employee/getgithubrepos/:_empId/').get(controller.getGitHubRepos);
        router.route('/employee/getgitlabrepos/:_empId/').get(controller.getGitLabRepos);
        router.route('/employee/getgitlabbranches/:_empId/:_repoId').get(controller.getGitLabBranches);
        router.route('/employee/getgitlabcommits/:_empId/:_repoId/:_branch/:since/:until/').get(controller.getGitLabCommits);
        router.route('/employee/getgithubbranches/:_empId/:_owner/:_repo').get(controller.getGitHubBanches);
        router.route('/employee/getgithubcommits/:_empId/:_owner/:_repo/:_branch/:_since/:until').get(controller.getGitHubCommits);
        return router;
    }
}

Object.seal(EmployeeRoutes);
export { EmployeeRoutes };