import * as express from "express";
import IMailServerModel = require("./../model/interfaces/IMailServerModel");
import { MailServerModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');
import { sendTestMail } from '../helpers/User.Helper';

/**
 * MailServers Controller
 * 
 * @class MailServersController
 */
class MailServersController extends BaseController {
    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var model = new MailServerModel();
            model.search({}, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        mailServers: result,
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

            let model = new MailServerModel();

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

            let Role: IMailServerModel = <IMailServerModel>req.body;


            let model = new MailServerModel();
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

            var MailServer: IMailServerModel = <IMailServerModel>req.body;

            var _id: string = req.params._id;


            var model = new MailServerModel();

            model.update(_id, MailServer).then((result) => {
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
            var model = new MailServerModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    /**
     * Test mail
     * @param req 
     * @param res 
     * @param next 
     */
    public test(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            return sendTestMail(req.body.email, req.headers.origin).then(resultEmail => {
                res.json(resultEmail.accepted.length > 0 ? true : false);
            }).catch(errorEmail => {
                res.json(false);
            })
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

}
export = MailServersController;


