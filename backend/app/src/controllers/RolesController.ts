import * as express from "express";
import IRoleModel = require("./../model/interfaces/IRoleModel");
import { RoleModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');

import { ModuleModel } from "../model/barrel/"

/**
 * Role Controller
 * 
 * @class RoleController
 */
class RolesController extends BaseController {

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

            var model = new RoleModel();

            model.search({}, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    
                    let returnResult = {
                        roles: result,
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

            let _id: string = req.params._id;
            let getPermissions: number = req.params.getPermissions;

            let model = new RoleModel();

            model.findWithPermissions(_id, getPermissions).then((result) => {
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

            let Role: IRoleModel = <IRoleModel>req.body;
            let rolePermissionsAry = req.body.permissions;

            let model = new RoleModel();
            model.createWithPermissions(Role, rolePermissionsAry).then((result) => {
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

            var Role: IRoleModel = <IRoleModel>req.body;

            var _id: string = req.params._id;
            let rolePermissionsAry = req.body.permissions;

            var model = new RoleModel();

            model.updateWithPermissions(_id, Role, rolePermissionsAry).then((result) => {
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
            var model = new RoleModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }


    public getModules(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {

            new ModuleModel().getModulesForRole().then((result) => {
                return res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

}
export = RolesController;    