import * as express from "express";
import TasksController = require("./../../controllers/TasksController");
var router = express.Router();
import SystemRouter = require("./../../lib/System.Router");

import multer = require('multer');
var upload = multer({ dest: 'uploads/tasks' })


/**
 * @class TaskRoutes
 */
class TaskRoutes {
    private _tasksController: TasksController;

    constructor() {
        this._tasksController = new TasksController();
    }
    get routes() {
        var controller = this._tasksController;
        // router = SystemRouter.setParametersRouters("tasks", controller, "task_group");

        //custom routes
        router.route("/tasks/view/:ws/:task_group/:_id").get(controller.view);
        router.route("/tasks/index/:ws/:task_group/").get(controller.index);
        router.route("/tasks/create/:ws/:task_group/").post(controller.create);
        router.route("/tasks/update/:ws/:task_group/:_id").put(controller.update);
        router.route("/tasks/delete/:ws/:task_group/:_id").delete(controller.delete);
        router.route("/tasks/updateOrder/:ws/:task_group/").put(controller.updateOrder);
        router.route(`/tasks/addComment/:ws/:task_group/:_id/`).post(controller.addComment);
        router.route(`/tasks/updateComment/:ws/:task_group/:_id/:_comment_id`).put(controller.updateComment);
        router.route(`/tasks/removeComment/:ws/:task_group/:_id/:_comment_id`).delete(controller.removeComment);
        router.post('/tasks/addAttachment/:ws/:task_group/:_id', upload.array("uploadFile[]"), controller.addAttachment);
        router.route(`/tasks/removeAttachment/:ws/:task_group/:_id/:_attach_id`).delete(controller.removeAttachment);
        router.route(`/tasks/downloadAttachment`).get(controller.downloadAttachment);
        router.route(`/tasks/assigned/:ws`).get(controller.findAssignedTasks);
        
        return router;
    }
}

Object.seal(TaskRoutes);
export { TaskRoutes };