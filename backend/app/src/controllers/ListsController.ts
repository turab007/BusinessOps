import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import { IListModel } from "./../model/interfaces/barrel/";
import { ListModel } from "./../model/barrel/";

import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');
import { shareList } from '../helpers/User.Helper';

/**
 * Lists Controller
 * 
 * @class ListsController
 */
class ListsController extends BaseController {
    /**
     *  List all records.
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
            var model = new ListModel();
            //For getting asending order of weight
            req.query['sort'] = { weight: 1 }

            model.search(cond, req.query).populate({path:'items',options:{sort:{'weight':1}}}).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        lists: result,
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

            let model = new ListModel();

            model.findById(_id).populate({ path: 'items', options: { sort: { 'weight': 1 } } }).then((result) => {
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
            let List: IListModel = <IListModel>req.body;
            List.work_space = workSpace;

            let model = new ListModel();
            model.create(List).then((result) => {
                res.json(result);
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
    public copy(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            var _id: string = req.params._id;
            let workSpace: string = req.params.ws;
            let List: IListModel = <IListModel>req.body;
            List.work_space = workSpace;

            console.log("--------copy-----------");
            console.log(List);

            let model = new ListModel();
            model.copy(_id, List).then((result) => {
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
            var List: IListModel = <IListModel>req.body;
            List.work_space = workSpace;

            var _id: string = req.params._id;
            var model = new ListModel();

            model.update(_id, List).then((result) => {
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
    public move(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let workSpace: string = req.params.ws;
            var List: IListModel = <IListModel>req.body;
            List.work_space = workSpace;

            var _id: string = req.params._id;
            var model = new ListModel();

            model.update(_id, List).then((result) => {
                return res.json(result);
            }).catch(next);
        }
        catch (error) {
            return next(ErrorMessages.modelValidationMessages(error));

        }

    }
    /**
     * Share List with email
     * @param req 
     * @param res 
     * @param next 
    */
    public share(req, res: express.Response, next: express.NextFunction): void {
        try {
            //req.headers.origin
            var _id: string = req.params._id;
  
            
            new ListModel().findById(_id).then(model => {
                model.shareEmail = req.body.shareEmail;
                return shareList(req.user,model, req.headers.origin).then(resultEmail => {
                    let emailStatus = resultEmail.accepted.length > 0 ? true : false
                    res.json({ status: emailStatus });

                }).catch(errorEmail => {
                    console.log({ status: false, error: errorEmail });
                    res.json({ status: false, error: errorEmail });
                })
            })


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
            let data: object = req.body.lists;
            let cond = {
                $and: [
                    { 'work_space': { $exists: true } },
                    { 'work_space': { $ne: null } },
                    { 'work_space': workSpace },
                    { _id: { $in: _.keys(data) } }
                ]
            }
            var model = new ListModel();

            model.findAllByAttributes(cond).then(result => {
                let resP = Promise.each(result, (list => {
                    console.log(list._id);
                    console.log(list.name);
                    console.log(data[list._id] + 1);
                    return model.update(list._id, <IListModel>{ weight: data[list._id] + 1 })
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
            var model = new ListModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

}
export = ListsController;


