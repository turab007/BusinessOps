import * as express from "express";
import { _ } from "lodash-node";
import IWorkSpaceModel = require("./../model/interfaces/IWorkSpaceModel");
import { WorkSpaceModel, AppletModel } from "./../model/barrel/";
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import Constants = require('../config/constants/Constants');

import UserModel = require("./../model/UserModel");
import IUserModel = require("./../model/interfaces/IUserModel");
import { getUserPayLoad } from '../helpers/User.Helper';


/**
 * WorkSpace Controller
 * 
 * @class WorkSpaceController
 */
class WorkSpaceController extends BaseController {

    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req, res: express.Response, next: express.NextFunction): void {
        try {
            //
            let current_user = req.session.current_user;

            // console.log(current_user);

            var model = new WorkSpaceModel();

            model.search({}, req.query).populate(['created_by']).populate('user_role._id').then((result) => {

                // Get total count
                model.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        workSpaces: result,
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
     * Get Those workspaces whom are not personal
     * @param req 
     * @param res 
     * @param next 
     */
    public getNotPersonal(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let current_user = getUserPayLoad(req.headers.authorization, new UserModel());

            var model = new WorkSpaceModel();

            let cond = {
                $and: [
                    { 'space_type': { $ne: null } },
                    { 'space_type': { $ne: "Personal" }, }
                ]
            }



            model.search(cond, req.query).populate(['created_by']).then((result) => {

                // Get total count
                model.count(cond, req.query).then(totalCount => {
                    let returnResult = {
                        workSpaces: result,
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

            let model = new WorkSpaceModel();

            // console.log('=================this is id================== ', _id);

            model.findById(_id).populate(' user_role._id').then((result) => {

                result = result.toJSON();

                // Get assigned applets
                let appletIds = result['modules'];

                return new AppletModel().find({ '_id': { $in: appletIds } }).then(appletResult => {
                    

                    if (appletResult.length > 0) {
                        result['applets'] = appletResult;
                    }

                    res.json(result);
                });



            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }

    public getWorkspaceUser(req, res: express.Response, next: express.NextFunction) {
        try {
            console.log(req.query);
            var _id: string = req.params._id;
            // console.log('===============this is ws id ===============', _id);
            let workSpaceModel = new WorkSpaceModel();
            workSpaceModel.findById(_id).then(ws => {
                let userModel = new UserModel();
                userModel.search({}, req.query).then((result) => {
                    console.log('this is query', req.query);
                    // req.query['select'] = ["first_name", "last_name"];
                    // console.log('====================created by====================== ', ws);
                    let cond = {
                        $and: [
                            { work_spaces: { $ne: ws._id } },
                            { _id: { $ne: ws.created_by } },
                            // {users:{"$not":{"$elemMatch":{"user":{$nin:result._id}}}}},
                            // { users: { $elemMatch: { $elemMatch:{ $ne:result._id}  } } },
                            // { users: { $elemMatch: { $ne: '_id' } } }


                        ]
                    }
                    userModel.search(cond, req.query).then((result) => {

                        // Get total count
                        userModel.count({}, req.query).then(totalCount => {
                            let returnResult = {
                                users: result,
                                totalCount: totalCount
                            }
                            // console.log(result); 

                            return res.json(returnResult);
                        });
                    });


                }).catch(next);

            })

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }

    /**
     * ASSOCIATE A USER WITH A WORKSPACE
     * @param req 
     * @param res 
     * @param next 
     */

    public addWorkspaceUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        let _id: string = req.params._id; //WORKSPACE TO ADD USER TO
        let model = new WorkSpaceModel();

        try {
            let user1 = req.body.user; //USER OBJECT
            let role = req.body.role;
            // console.log('===========this is role===============',role)
            let alreadyAdded: boolean = false; //BOOLEAN TO CHECK IF ALREADY ADDED
            let resultReturn; //FOR RESULT STRING
            new UserModel().findById(user1).then((user) => { //GET LATEST USER OBJECT
                // console.log('============for each===========', user);

                if (user.work_spaces.length > 0) {


                    user.work_spaces.forEach(space => {  //CHECK IF ALREADY ADDED
                        if (space == _id) {
                            alreadyAdded = true;
                            resultReturn = { message: 'Already added' };
                            return res.json(resultReturn);
                        }
                    });
                }

                {

                    if (!alreadyAdded) {
                        model.findById(_id).then((result => {
                            result = result.toJSON();
                            let userPromise = new UserModel().findById(user1); //MAKE USER PROMISE
                            new WorkSpaceModel().pushWorkSpace(_id, userPromise, role).then((result) => {
                                resultReturn = { message: 'Success' };
                                return res.json(resultReturn);
                            }).catch(next);
                        }));

                    }
                }
            });
        }

        catch (error) {

            return next(ErrorMessages.modelValidationMessages(error));

        }

    }

    updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {

        let _id: string = req.params._id; //WORKSPACE TO ADD USER TO
        let model = new WorkSpaceModel();
        let user1 = req.body.user;
        let ws = req.body.ws;

        // console.log('=============user==============',user1);
        // console.log('===============ws============',ws);
        try {
            // let user1 = req.body.element.user; //USER OBJECT
            // let ws=req.body.element.ws;
            // console.log('===================user===============',user1);
            // console.log('===================ws===============',ws);
            let role = req.body.role;
            let resultReturn; //FOR RESULT STRING
            // console.log('============for each===========', user);

            // if (user.work_spaces.length > 0) {


            //     user.work_spaces.forEach(space => {  //CHECK IF ALREADY ADDED
            //         if (space == _id) {

            //             resultReturn = { message: 'Already added' };
            //             return res.json(resultReturn);
            //         }
            //     });
            // }

            {
                


                model.findById(_id).then((result => {
                    result = result.toJSON();
                    // console.log('=========this is role in controller=============',role);
                    let userPromise = new UserModel().findById(user1); //MAKE USER PROMISE
                    new WorkSpaceModel().updateWorkSpace(_id, user1, role).then((result) => {
                        resultReturn = { message: 'Success' };
                        return res.json(resultReturn);
                    }).catch(next);
                }));


            }

        }

        catch (error) {

            return next(ErrorMessages.modelValidationMessages(error));

        }

    }


    /**
     * DISASSOCIATE A USER FROM A WORKSPACE
     * @param req 
     * @param res 
     * @param next 
     */


    public deleteWorkspaceUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        let _id: string = req.params._id; //WORKSPACE TO ADD USER TO
        let model = new WorkSpaceModel();

        try {
            let user1 = req.params._userId; //USER OBJECT
            // let alreadyAdded: boolean = false; //BOOLEAN TO CHECK IF ALREADY ADDED
            // let resultReturn; //FOR RESULT STRING



            model.findById(_id).populate('created_by').then((result => {
                result = result.toJSON();
                let userPromise = new UserModel().findById(user1); //MAKE USER PROMISE
                new WorkSpaceModel().removeWorkSpaceAssignment(_id, userPromise).then((result) => {
                    // resultReturn = { message: 'Success' };
                    return res.json(result);
                }).catch(next);
            }));

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
    public addApplet(req, res: express.Response, next: express.NextFunction): void {
        try {

            let _appletId: string = req.params._appletId;
            var _id: string = req.params._id;
            let appletPromise = new AppletModel().findById(_appletId);
            console.log('----------this is userPromise', appletPromise);
            new WorkSpaceModel().pushApplets(_id, appletPromise).then((result) => {
                return res.json(result);
            }).catch(next);
        }
        catch (error) {
            return next(ErrorMessages.modelValidationMessages(error));

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

            let WorkSpace: IWorkSpaceModel = <IWorkSpaceModel>req.body;

            console.log(WorkSpace);
            let model = new WorkSpaceModel();
            model.create(WorkSpace).then((result) => {
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
            let current_user = req['session'].current_user;
            var WorkSpace: IWorkSpaceModel = <IWorkSpaceModel>req.body;
            var _id: string = req.params._id;

            var model = new WorkSpaceModel();
            model.findById(_id).then(ws => {
                //PCM : Low (only allow owner to edit this)
                if (current_user._id == ws.created_by) {
                    model.update(_id, WorkSpace).then((result) => {
                        return res.json(result);

                    }).catch(next);
                }
                else {
                    return next(ErrorMessages.forbidden());
                }
            });


        }
        catch (error) {
            return next(ErrorMessages.modelValidationMessages(error));

        }
    }
    /**
     * Add workspace in against user 
     * @param req 
     * @param res 
     * @param next 
     */
    public addWorkSpace(req, res: express.Response, next: express.NextFunction): void {
        try {

            let current_user = new UserModel().findByEmail(req.user.user_id);
            var _id: string = req.params._id;
            new WorkSpaceModel().pushWorkSpace(_id, current_user, null).then((result) => {
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
    public removeApplet(req, res: express.Response, next: express.NextFunction): void {
        try {

            let _appletId: string = req.params._appletId;
            var _id: string = req.params._id;
            let appletPromise = new AppletModel().findById(_appletId);
            new WorkSpaceModel().pullApplets(_id, appletPromise).then((result) => {
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
    public delete(req, res, next: express.NextFunction): void {

        try {

            let current_user = new UserModel().findByEmail(req.user.user_id);

            var _id: string = req.params._id;
            new WorkSpaceModel().removeWorkSpaceAssignment(_id, current_user).then((result) => {
                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
}
export = WorkSpaceController;


