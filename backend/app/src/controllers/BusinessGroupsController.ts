import * as express from "express";
import IBusinessGroupModel = require("./../model/interfaces/IBusinessGroupModel");
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import { BusinessGroupModel } from "../model/barrel/"

/**
 * BusinessGroups Controller
 * 
 * @class BusinessGroupsController
 */
class BusinessGroupsController extends BaseController {
    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var model = new BusinessGroupModel();
            model.search({}, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        groups: result,
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

            let model = new BusinessGroupModel();

            model.findById(_id).then((result) => {
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

            let Role: IBusinessGroupModel = <IBusinessGroupModel>req.body;


            let model = new BusinessGroupModel();
            model.create(Role).then((result) => {
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

            var BusinessGroup: IBusinessGroupModel = <IBusinessGroupModel>req.body;

            var _id: string = req.params._id;


            var model = new BusinessGroupModel();

            model.update(_id, BusinessGroup).then((result) => {
                return res.json(result);
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

            var _id: string = req.params._id;
            var model = new BusinessGroupModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    
}
export = BusinessGroupsController;    