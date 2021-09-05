import * as express from "express";
import Promise = require('bluebird');
import _ = require('lodash-node');

import IAccountModel = require("./../model/interfaces/IAccountModel");
import { StatusFlowModel,AccountModel,TagModel,TimeZoneModel,
            BusinessGroupModel,UserBusinessGroupModel } 
    from "../model/barrel/"
import UserModel = require("./../model/UserModel");
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');



/**
 * Accounts Controller
 * 
 * @class AccountsController
 */
class AccountsController extends BaseController {
    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            var model = new AccountModel();

            // Get total count
            model.search({}, req.query).populate(['company_id', 'contact_id']).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        accounts: result,
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

            let model = new AccountModel();

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

            let Account: IAccountModel = <IAccountModel>req.body;


            let model = new AccountModel();
            model.createWithRelations(Account, Account.intersted_in).then((result) => {
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

            var Account: IAccountModel = <IAccountModel>req.body;

            var _id: string = req.params._id;


            var model = new AccountModel();

            model.updateWithRelations(_id, Account, Account.intersted_in).then((result) => {
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
            var model = new AccountModel();

            model.deleteWithRelations(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    /**
     * Get technologies from tags table 
     * e.g Select * From tags where data_type = 'Technologies'
     * @param req 
     * @param res 
     * @param next 
     */
    public getTechnologies(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {

            new TagModel().getAllTechnologies().then((result) => {
                res.json(result);
            }).catch(next);

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    /**
     * Get Timezones from tags table 
     * e.g Select * From timezones
     * @param req 
     * @param res 
     * @param next 
    */
    public getTimeZones(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {

            new TimeZoneModel().search({}, req.query).then((result) => {
                res.json(result);
            }).catch(next);

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    /**
     * View single record of TimeZone
     * @param req 
     * @param res 
     * @param next 
    */
    public viewTimeZone(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let _id: string = req.params._id;

            new TimeZoneModel().findById(_id).then((result) => {
                res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }

    /**
     * Get Current user business Groups
     * @param req 
     * @param res 
     * @param next 
     */
    public getBusinessGroupsByCurrentUser(req, res: express.Response, next: express.NextFunction): void {
        try {
            //TODO: Low (take this logic to model level)
            new UserModel().findByEmail(req.user.user_id).then(res1 => {
                console.log(res1._id);
                new UserBusinessGroupModel().getUserBuessinessIdsArray(res1._id).then(res2 => {
                    console.log(res2);
                    let cond = {
                        $and: [
                            { '_id': { $exists: true } },
                            { '_id': { $ne: null } },
                            { '_id': { $in: res2 }, }
                        ]
                    }

                    new BusinessGroupModel().findAllByAttributes(cond).then((result) => {
                        res.json(result);
                    }).catch(next);
                })

            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    /**
     * Get all the accounts by Statues and status should be only specific to current business Group of 
     * current user
     * @param req 
     * @param res 
     * @param next 
     */
    public getAccountsGroupByStatusByCurrentBusinessGroup(req, res: express.Response, next: express.NextFunction): void {
        try {
            //TODO: Low (take this logic to model level)
            new UserModel().findByEmail(req.user.user_id).then(res1 => {
                console.log(res1._id);
                new UserBusinessGroupModel().getUserBuessinessIdsArray(res1._id).then(res2 => {
                    let cond = {
                        $and: [
                            { '_id': { $exists: true } },
                            { '_id': { $ne: null } },
                            { '_id': { $in: res2 }, }
                        ]
                    }

                    new BusinessGroupModel().findByAttribute(cond).then((bgResult) => {
                        let cond = {
                            $and: [
                                { 'type': 'Account' },
                                { 'business_group_id': { $exists: true } },
                                { 'business_group_id': { $ne: null } },
                                { 'business_group_id': bgResult._id }
                            ]
                        }
                        new StatusFlowModel().findAllByAttributes(cond).then((stResult) => {
                            let statues = _.map(stResult, '_id');

                            let cond = {

                                $and: [

                                    { 'business_group': { $exists: true } },
                                    { 'business_group': { $ne: null } },
                                    { 'business_group': bgResult._id },
                                    { 'status': { $exists: true } },
                                    { 'status': { $ne: null } },
                                    { 'status': { $in: statues } },
                                ]
                            }
                            new AccountModel().findAllByAttributes(cond).populate(['company_id', 'contact_id']).then(res1 => {
                                res.json({ statuses: stResult, accounts: _.groupBy(res1, 'status') });
                            })

                        })

                    }).catch(next);
                })

            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }


}
export = AccountsController;


