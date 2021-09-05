import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import { IListItemModel } from "./../model/interfaces/barrel/";
import { ListItemModel, ListModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');


/**
 * ListItems Controller
 * 
 * @class ListItemsController
 */
class ListItemsController extends BaseController {
    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let list_id: string = req.params.list;
            console.log(list_id);

            let cond = {
                $and: [
                    { 'list_id': { $exists: true } },
                    { 'list_id': { $ne: null } },
                    { 'list_id': list_id }
                ]
            }
            
            var model = new ListItemModel();
            //For getting asending order of weight
            req.query['sort'] = { weight: 1}

            model.search(cond, req.query).then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        listItems: result,
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
            let list_id: string = req.params.list;
            let _id: string = req.params._id;

            let model = new ListItemModel();

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
            let list_id: string = req.params.list;
            let ListItem: IListItemModel = <IListItemModel>req.body;
            ListItem.list_id = list_id;


            let model = new ListItemModel();
            model.create(ListItem).then((result) => {
                //  let listmodel=new ListModel();
                // //  console.log("COndition=====",{_id:result.list_id});
                //  listmodel.findById('5a7028cee6cf4e23d06fac48').then(list=>
                // {
                //     list.items.push(result._id);
                //     listmodel.update(list._id,list);
                // })
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
            let list_id: string = req.params.list;
            var ListItem: IListItemModel = <IListItemModel>req.body;
            ListItem.list_id = list_id;

            var _id: string = req.params._id;
            var model = new ListItemModel();

            console.log("-----------");
            console.log(ListItem);

            model.update(_id, ListItem).then((result) => {
                return res.json(result);
            }).catch(next);
        }
        catch (error) {
            return next(ErrorMessages.modelValidationMessages(error));

        }

    }
    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    public updateOrder(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let list_id: string = req.params.list;
            let data : object = req.body.items;
            let cond = {
                $and: [
                    { 'list_id': { $exists: true } },
                    { 'list_id': { $ne: null } },
                    { 'list_id': list_id },
                    { _id : { $in: _.keys(data) }}
                ]
            }
            var model = new ListItemModel();

            model.findAllByAttributes(cond).then(result => {
                let resP = Promise.each(result, (item => {

                    return model.update(item._id, <IListItemModel>{ list_id:list_id,weight: data[item._id] + 1 })
                }))
                resP.then(out=>{
                    return res.json(result);
                })

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
            let list_id: string = req.params.list;
            var _id: string = req.params._id;
            var model = new ListItemModel();

            model.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

}
export = ListItemsController;


