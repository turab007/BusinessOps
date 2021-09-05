import * as express from "express";
import IContactModel = require("./../model/interfaces/IContactModel");
import { ContactModel } from "./../model/ContactModel";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');


/**
 * Contacts Controller
 * 
 * @class ContactsController
 */
class ContactsController extends BaseController {
    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var model = new ContactModel();

            model.search({}, req.query).populate('company').then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        contacts: result,
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

            let model = new ContactModel();

            model.findByIdWithRelations(_id).then((result) => {
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

            let Role: IContactModel = <IContactModel>req.body;


            let model = new ContactModel();
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

            var BusinessGroup: IContactModel = <IContactModel>req.body;

            var _id: string = req.params._id;


            var model = new ContactModel();

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
            var model = new ContactModel();

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
export = ContactsController;


