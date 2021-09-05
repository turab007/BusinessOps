import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import moment = require('moment');

import { IEodModel } from "./../model/interfaces/barrel/";
import { EodModel } from "./../model/barrel/";

import Constants = require('../config/constants/Constants');
import BaseController = require('./base/BaseController');
import ErrorMessages = require('../config/constants/Error.Messages');

class EodController extends BaseController {


    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let workSpace: string = req.params.ws;
            console.log('ws provided while calling index: ', workSpace);
            let cond = {
                $and: [
                    { 'work_space': { $exists: true } },
                    { 'work_space': { $ne: null } },
                    { 'work_space': workSpace }
                ]
            }
            var model = new EodModel();

            model.search(cond, req.query, 'updated_at').populate('created_by').then((result) => {
                // Get total count
                model.count(cond, req.query).then(totalCount => {
                    let returnResult = {
                        eodReports: result,
                        totalCount: totalCount
                    }

                    return res.json(returnResult);
                }).catch(next);
            }).catch(next);
        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }


    }

    public searchEOD(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let workSpace: string = req.params.ws;
            console.log('ws provided while calling index: ', workSpace);
            let cond;
            if (req.query.date && req.query.name) {

                 cond = {
                    $and: [
                        { 'work_space': { $exists: true } },
                        { 'work_space': { $ne: null } },
                        { 'work_space': workSpace },
                        { 'created_by': req.query.name },
                        { 'date': req.query.date }
                    ]
                }
            }
            else if (req.query.date) {

                 cond = {
                    $and: [
                        { 'work_space': { $exists: true } },
                        { 'work_space': { $ne: null } },
                        { 'work_space': workSpace },
                        { 'date': req.query.date }
                    ]
                }
            }
            else if ( req.query.name) {

                 cond = {
                    $and: [
                        { 'work_space': { $exists: true } },
                        { 'work_space': { $ne: null } },
                        { 'work_space': workSpace },
                        { 'created_by': req.query.name },
                       ]
                }
            }
            
            
                var model = new EodModel();

            console.log("----------------------------------------------------this is inside controller", req.query.name)

            model.search(cond, req.query, 'updated_at').populate('created_by').then((result) => {
                // Get total count
                model.count(cond, req.query).then(totalCount => {
                    let returnResult = {
                        eodReports: result,
                        totalCount: totalCount
                    }

                    return res.json(returnResult);
                }).catch(next);
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

            let model = new EodModel();
            //sort({ "comments.created_at": -1 })
            model.findById(_id).populate('created_by').populate('updated_by').populate('work_space').then((result) => {
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
            let ws: string = req.params.ws;
            let eodReport: IEodModel = <IEodModel>req.body;

            let model = new EodModel();
            model.create(eodReport).then((result) => {
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
    public update(req, res: express.Response, next: express.NextFunction): void {
        try {
            let workSpace: string = req.params.ws;
            var _id: string = req.params._id;
            var eodReport: IEodModel = <IEodModel>req.body;

            var model = new EodModel();

            model.update(_id, eodReport).then((result) => {
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
            var model = new EodModel();

            model.delete(_id).then((result) => {
                return res.json(result);
            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
}

export = EodController;


