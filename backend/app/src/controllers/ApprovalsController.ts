import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import { IApprovalModel, ICommentModel, IActivityLogModel, IAttachmentModel } from "./../model/interfaces/barrel/";
import { ApprovalModel, ActivityLogModel, WorkSpaceModel } from "./../model/barrel/";

import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');



/**
 * Approvals Controller
 * 
 * @class ApprovalsController
 */
class ApprovalsController extends BaseController {


    /**
     *  Approval all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req, res: express.Response, next: express.NextFunction): void {
        try {

            var wsModel = new WorkSpaceModel();
            let workSpace: string = req.params.ws;
            console.log(workSpace);
            let current_user = req.session.current_user;
            wsModel.findById(workSpace).then(ws => {

                let cond = {
                    $or: [
                        {
                            $and: [


                                { 'assign_to_workspace': { $exists: true } },
                                { 'assign_to_workspace': { $ne: null } },
                                { 'assign_to_workspace': workSpace },

                            ]
                        },
                        {
                            $and: [


                                { 'work_space': { $exists: true } },
                                { 'work_space': { $ne: null } },
                                { 'work_space': workSpace },

                            ]
                        }, {

                            $and: [
                                { 'assign_to_user': { $ne: null } },
                                { 'assign_to_workspace': { $ne: null } }
                            ]
                        }

                    ]
                };

                if (ws.space_type == 'Personal') {
                    cond.$or.push({
                        $and: [
                            { 'assign_to_user': { $exists: true } },
                            { 'assign_to_user': { $ne: null } },
                            { 'assign_to_user': current_user._id }

                        ]
                    })
                }
                var model = new ApprovalModel();
                //For getting asending order of weight
                req.query['sort'] = { weight: 1 }

                model.search(cond, req.query)
                    .populate('assign_to_workspace')
                    .populate('work_space')
                    .populate('assign_to_user')
                    .populate('created_by')
                    .then((result) => {

                        // Get total count
                        model.count({}, req.query).then(totalCount => {
                            let returnResult = {
                                approvals: result,
                                totalCount: totalCount
                            }

                            return res.json(returnResult);
                        });

                    }).catch(next);
            })
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
            let workSpace: string = req.params.ws;
            let _id: string = req.params._id;

            let model = new ApprovalModel();

            model.findById(_id).populate('created_by')
                .populate('comments.created_by')
                .populate('work_space')
                .populate('assign_to_workspace')
                .populate('assign_to_user').then((result) => {
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
            let workSpace: string = req.params.ws;
            let Approval: IApprovalModel = <IApprovalModel>req.body;
            Approval.work_space = workSpace;

            let model = new ApprovalModel();
            model.create(Approval).then((result) => {
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
            let workSpace: string = req.params.ws;
            var Approval: IApprovalModel = <IApprovalModel>req.body;

            var _id: string = req.params._id;
            let current_user = req.session.current_user;

            var model = new ApprovalModel();

            model.findById(_id).then(result => {
                let pre: IApprovalModel = result;

                model.update(_id, Approval).then((result) => {
                    let fieldsChanged = ApprovalsController.identifyChangedFields(pre, Approval);
                    // //adding Log entries
                    console.log('-----------------------fields changed inside task: ', fieldsChanged);
                    fieldsChanged.forEach(element => {

                        ApprovalsController.addLogEntry(_id,
                            element.data_affected,
                            element.new_value,
                            element.previous_value,
                            element.action,
                            current_user._id,
                            current_user.fullname);
                    });
                    return res.json(result);
                }).catch(next);
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
    public updateOrder(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let workSpace: string = req.params.ws;
            let data: object = req.body.approvalGroups;
            let cond = {
                $and: [
                    { 'work_space': { $exists: true } },
                    { 'work_space': { $ne: null } },
                    { 'work_space': workSpace },
                    { _id: { $in: _.keys(data) } }
                ]
            }
            var model = new ApprovalModel();

            model.findAllByAttributes(cond).then(result => {
                let resP = Promise.each(result, (approvalGroup => {

                    return model.update(approvalGroup._id, <IApprovalModel>{ weight: data[approvalGroup._id] + 1 })
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
            let workSpace: string = req.params.ws;
            var _id: string = req.params._id;
            var model = new ApprovalModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    public addComment(req, res: express.Response, next: express.NextFunction) {

        let workSpace: string = req.params.ws;
        let _id: string = req.params._id;
        let current_user = req.session.current_user;

        let comment: ICommentModel = <ICommentModel>req.body;

        let model = new ApprovalModel();

        model.findById(_id).then((approval) => {
            model.addComment(approval, comment, current_user._id).then((result) => {
                if (result && result.comments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.comments = _.sortBy(result.comments, "created_at").reverse();

                    //ADDING LOG ENTRY
                    ApprovalsController.addLogEntry(_id, 'comment', comment.comment, null, 'add', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);

        }).catch(next);
    }

    public updateComment(req, res: express.Response, next: express.NextFunction) {

        let workSpace: string = req.params.ws;
        let _id: string = req.params._id;
        let _comment_id: string = req.params._comment_id;
        let current_user = req.session.current_user;
        let comment: ICommentModel = <ICommentModel>req.body;

        let model = new ApprovalModel();

        model.findById(_id).then((approval) => {
            let previousValue: any = model.getComment(approval, _comment_id);
            model.updateComment(approval, comment, _comment_id).then((result) => {
                if (result && result.comments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.comments = _.sortBy(result.comments, "created_at").reverse();

                    // ADDING LOG ENTRY
                    ApprovalsController.addLogEntry(_id, 'comment', comment.comment, previousValue.comment, 'update', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);

        }).catch(next);
    }

    public removeComment(req, res: express.Response, next: express.NextFunction) {
        // let workSpace: string = req.params.ws;
        let _id: string = req.params._id;
        let _comment_id: string = req.params._comment_id;
        let current_user = req.session.current_user;

        let model = new ApprovalModel();


        model.findById(_id).then((approval) => {
            let previousValue: any = model.getComment(approval, _comment_id);
            model.removeComment(approval, _comment_id)
                .then((result) => {
                    if (result && result.comments) {
                        //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                        result.comments = _.sortBy(result.comments, "created_at").reverse();

                        // ADDING LOG ENTRY
                        ApprovalsController.addLogEntry(_id, 'comment', null, previousValue.comment, 'delete', current_user._id, current_user.fullname);

                    }
                    return res.json(result);
                }).catch(next);
        }).catch(next);
    }

    public addAttachment(req, res: express.Response, next: express.NextFunction) {
        console.log("I am inside task Routes", req.files);

        // let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let current_user = req.session.current_user;

        let model = new ApprovalModel();
        let attach: IAttachmentModel = <IAttachmentModel>req.files[0];

        // let attachment = req.files;
        model.findById(_id).then((approval) => {
            model.addAttachment(approval, attach, current_user._id).then((result) => {
                if (result && result.attachments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.attachments = _.sortBy(result.attachments, "created_at").reverse();

                    // //ADDING LOG ENTRY
                    ApprovalsController.addLogEntry(_id, 'attachment', attach.originalname, null, 'add', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);
        }).catch(next);
    }

    public removeAttachment(req, res: express.Response, next: express.NextFunction) {
        let task_group_id: string = req.params.task_group;
        let _id: string = req.params._id;
        let _attach_id: string = req.params._attach_id;
        let current_user = req.session.current_user;

        let model = new ApprovalModel();

        model.findById(_id).then((task) => {
            let previousValue: any = model.getAttachment(task, _attach_id);
            model.removeAttachment(task, _attach_id).then((result) => {
                if (result && result.attachments) {
                    //PCM: low (right now above sorting method is not working thats why doing manual sorting)  
                    result.attachments = _.sortBy(result.attachments, "created_at").reverse();

                    // // ADDING LOG ENTRY
                    ApprovalsController.addLogEntry(_id, 'attachment', null, previousValue.originalname, 'delete', current_user._id, current_user.fullname);
                }
                return res.json(result);
            }).catch(next);
        }).catch(next);
    }

    downloadAttachment(req, res: express.Response, next: express.NextFunction) {

        console.log()
        // let task_group_id: string = req.params.task_group;
        let _id: string = req.query.approval;
        let _attach_id: string = req.query.id;
        // let current_user = req.session.current_user;

        let model = new ApprovalModel();

        model.findById(_id).then((task) => {
            let attach: IAttachmentModel = model.getAttachment(task, _attach_id);
            console.log('--------------------------attach-------------------', attach);
            res.download(attach.path, attach.originalname);

        }).catch(next);
    }

    /**
 * identify the updates made to the model
 * 
 * @param pre previous model
 * @param cur new model
 */
    public static identifyChangedFields(pre: IApprovalModel, cur: IApprovalModel) {
        let out: any[] = [];

        if (cur.status && cur.status != '' && pre.status != cur.status) {
            if (pre.status)
                out.push({ data_affected: 'status', new_value: cur.status, previous_value: pre.status, action: 'update' })
            else
                out.push({ data_affected: 'status', new_value: cur.status, previous_value: null, action: 'add' })
        }
        if (cur.due_date && cur.due_date != '') {
            if (pre.due_date && pre.due_date != cur.due_date)
                out.push({ data_affected: 'due date', new_value: cur.due_date, previous_value: pre.due_date, action: 'update' })
            else if (!pre.due_date)
                out.push({ data_affected: 'due date', new_value: cur.due_date, previous_value: null, action: 'add' })

        }
        if (cur.description && cur.description != '' && pre.description != cur.description) {
            if (pre.description)
                out.push({ data_affected: 'description', new_value: cur.description, previous_value: pre.description, action: 'update' })
            else
                out.push({ data_affected: 'description', new_value: cur.description, previous_value: null, action: 'add' })

        }
        if (cur.name && cur.name != '' && pre.name != cur.name) {
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
    public static addLogEntry(_id: string, data_affected: string, new_value: string, previous_value: string, action: string, userId: string, userName: string) {

        // ADDING LOG ENTRY
        new ActivityLogModel()
            .create({
                model_changed: 'approval',
                document_id: _id,
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


export = ApprovalsController;

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
    */
