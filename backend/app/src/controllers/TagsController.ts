import * as express from "express";
import ITagModel = require("./../model/interfaces/ITagModel");
import { TagModel } from "./../model/TagModel";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');


/**
 * Tags Controller
 * 
 * @class TagsController
 */
class TagsController extends BaseController {
    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var model = new TagModel();
            model.search({}, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        tags: result,
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

            let model = new TagModel();

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

            let Role: ITagModel = <ITagModel>req.body;


            let model = new TagModel();
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

            var Tag: ITagModel = <ITagModel>req.body;

            var _id: string = req.params._id;


            var model = new TagModel();

            model.update(_id, Tag).then((result) => {
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
            var model = new TagModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    public getTypes(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            res.json(Constants.tagTypes.sort())

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }
}
export = TagsController;


