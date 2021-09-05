import * as express from "express";
import IRoleWorkspacePermissionModel = require("./../model/interfaces/IRoleWorkspacePermission");
import { RoleWorkspacePermission, PermissionModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');

/**
 * 
 * RoleWorkspacePermission Controller
 * 
 * @class RoleWorkspacePermissionController
 */
class RoleWorkspacePermissionsController extends BaseController {

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

            var model = new RoleWorkspacePermission();

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
            var model = new RoleWorkspacePermission();

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
            var ws=req.params.ws;

            var roleWorkspacePermission: IRoleWorkspacePermissionModel = <IRoleWorkspacePermissionModel>req.body;
            var model = new RoleWorkspacePermission();
            model.create(roleWorkspacePermission).then((result) => {
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
            var roleWorkspacePermission: IRoleWorkspacePermissionModel = <IRoleWorkspacePermissionModel>req.body;
            var _id: string = req.params._id;
            var model = new RoleWorkspacePermission();
            model.update(_id, roleWorkspacePermission).then((result) => {
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
            var model = new RoleWorkspacePermission();

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
            var ws: string= req.params.ws;
            var model = new RoleWorkspacePermission();
            let arr = [_id];

            model.getPermissions(arr,ws).then((result) => {

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
            var _ws:string=req.params.ws;

            console.log("========ids are============", _roleId, _permId,_ws)
            var model = new RoleWorkspacePermission();
            model.deleteRoleWorkspacePermission(_roleId, _permId,_ws).then(result => {
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
export = RoleWorkspacePermissionsController;    