import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import moment = require('moment');
import { ITaskModel, ICommentModel, IActivityLogModel, IAttachmentModel } from "./../model/interfaces/barrel/";
import { TaskModel, ActivityLogModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');
// var path = require('path');


import UserModel = require('../model/UserModel');

/**
 * Tasks Controller
 * 
 * @class TasksController
 */
class TasksController extends BaseController {


    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            let task_group_id: string = req.params.task_group;

            let cond = {
                $and: [
                    { 'task_group_id': { $exists: true } },
                    { 'task_group_id': { $ne: null } },
                    { 'task_group_id': task_group_id }
                ]
            }

            var model = new TaskModel();
            //For getting asending order of weight
            req.query['sort'] = { weight: 1 }

            model.search(cond, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        tasks: result,
                        totalCount: totalCount
                    }

                    return res.json(returnResult);
                });

            }).catch(next);
        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }

    /**
     * View single record
     * @param req 
     * @param res 
     * @param next 
     */
    public view(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let _id: string = req.params._id;
            console.log("===============this is taskgroup id=================",_id);

            let model = new TaskModel();
            //sort({ "comments.created_at": -1 })
            model.findById(_id).populate('created_by').populate('comments.created_by').then((result) => {
                if (result && result.comments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)
                    result.comments = _.sortBy(result.comments, "created_at").reverse();
                }
                res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }

    /**
     * Create new record
     * @param req 
     * @param res 
     * @param next 
     */
    public create(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            let task_group_id: string = req.params.task_group;
            let Task: ITaskModel = <ITaskModel>req.body;
            Task.task_group_id = task_group_id;


            let model = new TaskModel();
            model.create(Task).then((result) => {
                res.json(result);
            }).catch(next);
        }
        catch (error) {

            return next(ErrorMessages.modelValidationMessages(error));
        }
    }

    /**
     * Update existing record
     * @param req 
     * @param res 
     * @param next 
     */
    public update(req, res: express.Response, next: express.NextFunction): void {

        try {
            var curTask: ITaskModel = <ITaskModel>req.body;

            let current_user = req.session.current_user;
            var _id: string = req.params._id;


            var model = new TaskModel();

            model.findById(_id).populate('assigned_to').populate('task_group_id').then(pre => {
                let preTask: ITaskModel = pre;

                model.update(_id, curTask).then((result) => {

                    model.findById(_id).populate('assigned_to').populate('task_group_id').then(cur => {
                        curTask = cur;

                        let fieldsChanged = TasksController.identifyChangedFields(preTask, curTask);
                        // //adding Log entries
                        console.log('-----------------------fields changed inside task: ', fieldsChanged);
                        fieldsChanged.forEach(element => {

                            TasksController.addLogEntry(_id,
                                element.data_affected,
                                element.new_value,
                                element.previous_value,
                                element.action,
                                current_user._id,
                                current_user.fullname);
                        });

                    });
                    // if (curTask.assigned_to !== "") {

                    //     new UserModel().findById(curTask.assigned_to).then(res => {
                    //         curTask.assigned_to = res;
                    //     });
                    // }

                    return res.json(result);
                }).catch(next);
            }).catch(next);
        }
        catch (error) {
            return next(ErrorMessages.modelValidationMessages(error));
        }
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    public updateOrder(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let task_group_id: string = req.params.task_group;
            let data: object = req.body.tasks;
            let cond = {
                $and: [
                    { 'task_group_id': { $exists: true } },
                    { 'task_group_id': { $ne: null } },
                    { 'task_group_id': task_group_id },
                    { _id: { $in: _.keys(data) } }
                ]
            }
            var model = new TaskModel();

            model.findAllByAttributes(cond).then(result => {
                let resP = Promise.each(result, (item => {

                    return model.update(item._id, <ITaskModel>{ task_group_id: task_group_id, weight: data[item._id] + 1 })
                }))
                resP.then(out => {
                    return res.json(result);
                })

            }).catch(next);

        }
        catch (error) {
            return next(ErrorMessages.modelValidationMessages(error));

        }

    }

    /**
    * Delete single record.
    * @param req 
    * @param res 
    * @param next 
    */
    public delete(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            let task_group_id: string = req.params.task_group;
            var _id: string = req.params._id;
            var model = new TaskModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    public findAssignedTasks(req, res: express.Response, next: express.NextFunction): void {
        try {
            let assigned_to = req.session.current_user;

            let cond = {
                $and: [
                    { 'assigned_to': { $exists: true } },
                    { 'assigned_to': { $ne: null } },
                    { 'assigned_to': assigned_to._id }
                ]
            }

            var model = new TaskModel();

            model.search(cond, req.query).populate('task_group_id').then((result) => {

                return res.json(result);

            }).catch(next);
        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    public addComment(req, res: express.Response, next: express.NextFunction) {

        let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let current_user = req.session.current_user;

        let comment: ICommentModel = <ICommentModel>req.body;

        let model = new TaskModel();

        model.findById(_id).then((task) => {
            model.addComment(task, comment, current_user._id).then((result) => {
                if (result && result.comments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.comments = _.sortBy(result.comments, "created_at").reverse();

                    //ADDING LOG ENTRY
                    TasksController.addLogEntry(_id, 'comment', comment.comment, null, 'add', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);

        }).catch(next);
    }

    public updateComment(req, res: express.Response, next: express.NextFunction) {

        let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let _comment_id: string = req.params._comment_id;
        let current_user = req.session.current_user;
        let comment: ICommentModel = <ICommentModel>req.body;

        let model = new TaskModel();

        model.findById(_id).then((task) => {
            let previousValue: any = model.getComment(task, _comment_id);
            model.updateComment(task, comment, _comment_id).then((result) => {
                if (result && result.comments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.comments = _.sortBy(result.comments, "created_at").reverse();

                    // ADDING LOG ENTRY
                    TasksController.addLogEntry(_id, 'comment', comment.comment, previousValue.comment, 'update', current_user._id, current_user.fullname);

                }
                return res.json(result);
            }).catch(next);

        }).catch(next);
    }

    public removeComment(req, res: express.Response, next: express.NextFunction) {
        let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let _comment_id: string = req.params._comment_id;
        let current_user = req.session.current_user;

        let model = new TaskModel();

        model.findById(_id).then((task) => {
            let previousValue: any = model.getComment(task, _comment_id);
            model.removeComment(task, _comment_id).then((result) => {
                if (result && result.comments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.comments = _.sortBy(result.comments, "created_at").reverse();

                    // ADDING LOG ENTRY
                    TasksController.addLogEntry(_id, 'comment', null, previousValue.comment, 'delete', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);
        }).catch(next);
    }

    public addAttachment(req, res: express.Response, next: express.NextFunction) {
        

        let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let current_user = req.session.current_user;

        let model = new TaskModel();
        let attach: IAttachmentModel = <IAttachmentModel>req.files[0];

        // let attachment = req.files;
        model.findById(_id).then((task) => {
            model.addAttachment(task, attach, current_user._id).then((result) => {
                if (result && result.attachments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.attachments = _.sortBy(result.attachments, "created_at").reverse();

                    //ADDING LOG ENTRY
                    TasksController.addLogEntry(_id, 'attachment', attach.originalname, null, 'add', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);
        }).catch(next);
    }

    public downloadAttachment(req, res: express.Response, next: express.NextFunction) {

        // let task_group_id: string = req.params.task_group;
        let _id: string = req.query.task;
        let _attach_id: string = req.query.id;
        // let current_user = req.session.current_user;

        let model = new TaskModel();

        model.findById(_id).then((task) => {
            let attach: IAttachmentModel = model.getAttachment(task, _attach_id);
            res.download(attach.path, attach.originalname);

        }).catch(next);


        // let attach: IAttachmentModel = <IAttachmentModel>req.body;

        // var filename = path.basename(file);
        // var mimetype = attach.mimetype;

        // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        // res.setHeader('Content-type', mimetype);

        // var filestream = fs.createReadStream(file);
        // filestream.pipe(res);
    }

    public removeAttachment(req, res: express.Response, next: express.NextFunction) {
        let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let _attach_id: string = req.params._attach_id;
        let current_user = req.session.current_user;

        let model = new TaskModel();

        model.findById(_id).then((task) => {
            let previousValue: any = model.getAttachment(task, _attach_id);
            model.removeAttachment(task, _attach_id).then((result) => {
                if (result && result.attachments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.attachments = _.sortBy(result.attachments, "created_at").reverse();

                    // ADDING LOG ENTRY
                    TasksController.addLogEntry(_id, 'attachment', null, previousValue.originalname, 'delete', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);
        }).catch(next);
    }

    /**
    * identify the updates made to the task model
    * 
    * @param pre previous task model
    * @param cur new task model
    */
    public static identifyChangedFields(pre: ITaskModel, cur: ITaskModel) {
        let out: any[] = [];
        if (cur.assigned_to && cur.assigned_to !== undefined) {
            if (pre.assigned_to && pre.assigned_to.user_id !== cur.assigned_to.user_id) {

                out.push({ data_affected: 'assigned to', new_value: cur.assigned_to.fullname, previous_value: pre.assigned_to.fullname, action: 'update' });
            }
            else if (!pre.assigned_to) {
                out.push({ data_affected: 'assigned to', new_value: cur.assigned_to.fullname, previous_value: null, action: 'add' });
            }
        }
        if (cur.task_group_id && pre.task_group_id && !pre.task_group_id._id.equals(cur.task_group_id._id)) {

            out.push({ data_affected: 'task group', new_value: cur.task_group_id.name, previous_value: pre.task_group_id.name, action: 'update' });
        }
        if (cur.status && cur.status !== '' && pre.status !== cur.status) {
            if (pre.status)
                out.push({ data_affected: 'status', new_value: cur.status, previous_value: pre.status, action: 'update' })
            else
                out.push({ data_affected: 'status', new_value: cur.status, previous_value: null, action: 'add' })
        }
        if (cur.priority && cur.priority !== '' && pre.priority !== cur.priority) {
            if (pre.priority)
                out.push({ data_affected: 'priority', new_value: cur.priority, previous_value: pre.priority, action: 'update' })
            else
                out.push({ data_affected: 'priority', new_value: cur.priority, previous_value: null, action: 'add' })

        }
        if (cur.start_date && cur.start_date !== '') {
            if (pre.start_date && pre.start_date !== cur.start_date)
                out.push({ data_affected: 'start date', new_value: cur.start_date, previous_value: pre.start_date, action: 'update' })
            else if (!pre.start_date)
                out.push({ data_affected: 'start date', new_value: cur.start_date, previous_value: null, action: 'add' })

        }
        if (cur.due_date && cur.due_date !== '') {
            if (pre.due_date && pre.due_date !== cur.due_date)
                out.push({ data_affected: 'due date', new_value: cur.due_date, previous_value: pre.due_date, action: 'update' })
            else if (!pre.due_date)
                out.push({ data_affected: 'due date', new_value: cur.due_date, previous_value: null, action: 'add' })

        }
        if (cur.description && cur.description !== '' && pre.description !== cur.description) {
            if (pre.description)
                out.push({ data_affected: 'description', new_value: cur.description, previous_value: pre.description, action: 'update' })
            else
                out.push({ data_affected: 'description', new_value: cur.description, previous_value: null, action: 'add' })

        }
        if (cur.name && cur.name !== '' && pre.name !== cur.name) {
            if (pre.name)
                out.push({ data_affected: 'name', new_value: cur.name, previous_value: pre.name, action: 'update' })
            else
                out.push({ data_affected: 'name', new_value: cur.name, previous_value: null, action: 'add' })

        }
        return out;
    }

    /**
    * add a log entry to activity log model
    * 
    * @param t_id task id
    * @param data_affected affected member/field
    * @param new_value new value of affected field
    * @param previous_value previous value of affected field
    * @param action action performed on field
    * @param userId user id who performed action
    * @param userName user name who performed action
    */
    public static addLogEntry(t_id: string, data_affected: string, new_value: string, previous_value: string, action: string, userId: string, userName: string) {

        console.log("=================adding log entry===================",t_id,data_affected,new_value,previous_value,action,userId,userName);
        // ADDING LOG ENTRY
        new ActivityLogModel()
            .create({
                model_changed: 'task',
                document_id: t_id,
                data_affected: data_affected,
                new_value: new_value,
                previous_value: previous_value,
                action: action,
                action_by: {
                    _id: userId,
                    name: userName
                }
            });
    }

}

export = TasksController;


