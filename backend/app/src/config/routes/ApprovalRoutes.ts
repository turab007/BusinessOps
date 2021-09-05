import * as express from "express";
import ApprovalsController = require("./../../controllers/ApprovalsController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");
import multer = require('multer');
var upload = multer({ dest: 'uploads/approvals' })



/**
 * @class ApprovalRoutes
 */
class ApprovalRoutes {
    private _approvalsController: ApprovalsController;

    constructor() {
        this._approvalsController = new ApprovalsController();
    }
    get routes() {
        var controller = this._approvalsController;
        router = SystemRouter.setParametersRouters("approvals", controller, "ws", "Approvals");
        //custom routes
        router.route("/approvals/updateOrder/:ws/").put(controller.updateOrder);
        router.route(`/approvals/addComment/:ws/:_id`).post(controller.addComment);
        router.route(`/approvals/updateComment/:ws/:_id/:_comment_id`).put(controller.updateComment);
        router.route(`/approvals/removeComment/:ws/:_id/:_comment_id`).delete(controller.removeComment);
        router.post('/approvals/addAttachment/:ws/:_id', upload.array("uploadFile[]"), controller.addAttachment);
        router.route(`/approvals/removeAttachment/:ws/:_id/:_attach_id`).delete(controller.removeAttachment);
        router.route(`/approvals/downloadAttachment/`).get(controller.downloadAttachment);  //TODO: ADD WSID IN ROUTE


        return router;
    }
}

Object.seal(ApprovalRoutes);
export { ApprovalRoutes };