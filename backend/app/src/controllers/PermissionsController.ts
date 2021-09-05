import * as express from "express";
import IPermissionModel = require("./../model/interfaces/IPermissionModel");
import { PermissionModel} from "../model/barrel/"
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');

/**
 * TODO:low: This controller is only for test data entries in documet/talbe.. Delete it before productiong
 * TODO:high: There should be a proper way for inserting Permissions entries and it should not involve controller..
 * 
 * Permission Controller
 * 
 * @class PermissionController
 */
class PermissionsController extends BaseController {

    public findByModule(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {

            var module_id: string = req.params.module_id;

            var model = new PermissionModel();

            model.findByModule(module_id).then((result) => {
                return res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

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

            var model = new PermissionModel();

            model.retrieve().then((result) => {
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
            var model = new PermissionModel();

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

            var Permission: IPermissionModel = <IPermissionModel>req.body;
            var model = new PermissionModel();
            model.create(Permission).then((result) => {
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
            var Permission: IPermissionModel = <IPermissionModel>req.body;
            var _id: string = req.params._id;
            var model = new PermissionModel();
            model.update(_id, Permission).then((result) => {
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
            var model = new PermissionModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }


}
export = PermissionsController;    