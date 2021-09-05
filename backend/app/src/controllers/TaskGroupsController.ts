import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import { ITaskGroupModel } from "./../model/interfaces/barrel/";
import { TaskGroupModel } from "./../model/barrel/";

import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');


/**
 * TaskGroups Controller
 * 
 * @class TaskGroupsController
 */
class TaskGroupsController extends BaseController {
    /**
     *  TaskGroup all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let workSpace: string = req.params.ws;
            console.log(workSpace);
            let cond = {
                $and: [
                    { 'work_space': { $exists: true } },
                    { 'work_space': { $ne: null } },
                    { 'work_space': workSpace }
                ]
            }
            var model = new TaskGroupModel();
            //For getting asending order of weight
            req.query['sort'] = { weight: 1}

            model.search(cond, req.query).populate({ path: 'tasks',  options: {sort: {'weight': 1}},populate:{path:'assigned_to'}}).then((result) => {

                // Get total count
                model.count({}, req.query).populate({ path: 'tasks',  options: {sort: {'weight': 1}}}).then(totalCount => {
                    let returnResult = {
                        taskGroups: result,
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
            let workSpace: string = req.params.ws;
            let _id: string = req.params._id;

            let model = new TaskGroupModel();

            model.findById(_id).populate({ path: 'tasks',  options: {sort: {'weight': 1}}}).then((result) => {
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
            let TaskGroup: ITaskGroupModel = <ITaskGroupModel>req.body;
            TaskGroup.work_space = workSpace;

            let model = new TaskGroupModel();
            model.create(TaskGroup).then((result) => {
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
    public update(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let workSpace: string = req.params.ws;
            var TaskGroup: ITaskGroupModel = <ITaskGroupModel>req.body;
            TaskGroup.work_space = workSpace;

            var _id: string = req.params._id;
            var model = new TaskGroupModel();

            model.update(_id, TaskGroup).then((result) => {
                return res.json(result);
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
            let data : object = req.body.taskGroups;
            let cond = {
                $and: [
                    { 'work_space': { $exists: true } },
                    { 'work_space': { $ne: null } },
                    { 'work_space': workSpace },
                    { _id : { $in: _.keys(data) }}
                ]
            }
            var model = new TaskGroupModel();

            model.findAllByAttributes(cond).then(result => {
                let resP = Promise.each(result, (taskGroup => {
       
                    return model.update(taskGroup._id, <ITaskGroupModel>{ weight: data[taskGroup._id] + 1 })
                }))
                resP.then(out=>{
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
            var model = new TaskGroupModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

}
export = TaskGroupsController;


