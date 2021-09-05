import * as express from "express";
import IRolePermissionModel = require("./../model/interfaces/IRolePermissionModel");
import { RolePermissionModel, PermissionModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');

/**
 * 
 * RolePermission Controller
 * 
 * @class RolePermissionController
 */
class RolePermissionsController extends BaseController {

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

            var model = new RolePermissionModel();

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
            var model = new RolePermissionModel();

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

            var RolePermission: IRolePermissionModel = <IRolePermissionModel>req.body;
            var model = new RolePermissionModel();
            model.create(RolePermission).then((result) => {
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
            var RolePermission: IRolePermissionModel = <IRolePermissionModel>req.body;
            var _id: string = req.params._id;
            var model = new RolePermissionModel();
            model.update(_id, RolePermission).then((result) => {
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
            var model = new RolePermissionModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    public getPermissions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var _id: string = req.params._id;
            var model = new RolePermissionModel();
            let arr = [_id];

            model.getPermissions(arr).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    public unassignPermission(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {


            var _roleId: string = req.body._roleId;
            var _permId: string = req.body._permId;

            console.log("========ids are============", _roleId, _permId)
            var model = new RolePermissionModel();
            model.deleteRolePermission(_roleId, _permId).then(result => {
                return res.json(result);
            });
            // let arr=[_id];

            // model.getPermissions(arr).then((result) => {

            //     return res.json(result);

            // }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    


}
export = RolePermissionsController;    