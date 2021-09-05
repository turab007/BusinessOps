import * as express from "express";
import IAppletModel = require("./../model/interfaces/IAppletModel");
import { AppletModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');

/**
 * 
 * Applets Controller
 * 
 * @class AppletsController
 */
class AppletsController extends BaseController {

    /**
     * 
     * List all records.
     * 
     * @method index
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {

            let model = new AppletModel();

            model.find({status: true }).then((result) => {
                return res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }



    /**
     * 
     * View single record
     * 
     * @method view
     * @param req 
     * @param res 
     * @param next 
     */
    public view(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var _id: string = req.params._id;
            var model = new AppletModel();

            model.findById(_id).then((result) => {
                res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    /**
     * 
     * Create new record
     * 
     * @method create
     * @param req 
     * @param res 
     * @param next 
     */
    public create(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var Applet: IAppletModel = <IAppletModel>req.body;
            var model = new AppletModel();
            model.create(Applet).then((result) => {
                res.json(result);
            }).catch(next);
        }
        catch (e) {

            return ErrorMessages.errorHandler(e, next);
        }
    }

    /**
     * 
     * Update existing record
     * 
     * @param req
     * @param res 
     * @param next 
     */
    public update(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            var Applet: IAppletModel = <IAppletModel>req.body;
            var _id: string = req.params._id;
            var model = new AppletModel();
            model.update(_id, Applet).then((result) => {
                return res.json(result);
            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    /**
     * 
     * Delete single record.
     * 
     * @param req
     * @param res 
     * @param next 
     */
    public delete(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var _id: string = req.params._id;
            var model = new AppletModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }


}
export = AppletsController;    