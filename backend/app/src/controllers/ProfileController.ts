import * as express from "express";
import IUserModel = require("./../model/interfaces/IUserModel");
import UserModel = require("./../model/UserModel");
//  
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import { WorkSpaceModel, AppletModel, ListModel, ApprovalModel, EodModel, TaskGroupModel } from "./../model/barrel/";


/**
 * Profile Controller
 * 
 * @class Profile Controller
 */
class ProfileController extends BaseController {

    public changePassword(req, res: express.Response, next: express.NextFunction): void {
        try {

            // let User: IUserModel = <IUserModel>{'password_hash':req.body.new_password};
            let User: IUserModel = <IUserModel>req.body;
            User.password_hash = User.new_password;

            let userModel = new UserModel();


            userModel.findByUserIdAndupdatePassword(req.user.user_id, User).then((result) => {

                // TODO:low (some how it is not going to catch)
                if (result.errors) {
                    throw result;
                }
                else {
                    res.json(result);
                }

            }).catch(errors => {
                console.log(errors);
                return next(ErrorMessages.invalidOldPassword());
            });
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    public view(req, res: express.Response, next: express.NextFunction): void {
        try {

            let userModel = new UserModel();

            userModel.findByAttribute({ user_id: req.user.user_id }).then((result) => {
                res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    /**
  * 
  * Update the profile
  * 
  * @param req
  * @param res 
  * @param next 
  */
    public update(req, res: express.Response, next: express.NextFunction): void {
        try {

            let User: IUserModel = <IUserModel>req.body;
            let userModel = new UserModel();


            userModel.updateByCondition({ user_id: req.user.user_id }, User).then((result) => {
                return res.json(result);
            }).catch(error => {
                console.log(error);
                return next(ErrorMessages.modelValidationMessages(error));
            });
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    /**
     * Get Personal work spaces
     * @param req 
     * @param res 
     * @param next 
    */
    public getPersonalWorkSpaces(req, res: express.Response, next: express.NextFunction): void {
        try {
            new UserModel().findByEmail(req.user.user_id).then(res1 => {


                console.log('current user------------------------------------------', res1);
                new WorkSpaceModel().getSelectedWorkSpaces(res1.work_spaces, res1._id).then(wRes => {
                    return res.json(wRes);
                })
            })

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    public getAppletCount(req, res, next: express.NextFunction) {

        let AppletCount = [];
        try {

            new UserModel().findByEmail(req.user.user_id).then(res1 => {


                console.log('current user------------------------------------------', res1);
                new WorkSpaceModel().getSelectedWorkSpaces(res1.work_spaces, res1._id).then(wRes => {
                    let length = 0;
                    wRes.forEach(ws => {
                        // length++;
                        // let listCount;
                        // let approvalCount;
                        // let taskGroupCount;
                        // let eodCount;
                        let p1 = new ListModel().count({ work_space: ws._id }, {}).then(count => {
                            return count;
                        })
                        let p2 = new ApprovalModel().count({ work_space: ws._id }, {}).then(count => {
                            return count;

                        })
                        let p3 = new TaskGroupModel().count({ work_space: ws._id }, {}).then(count => {
                            return count;
                        })

                        let p4 = new EodModel().count({ work_space: ws._id }, {}).then(count => {
                            return count;
                        })

                        return Promise.all([p1, p2, p3, p4]).then(resp => {
                            let count = {
                                name: ws.name,
                                _id: ws._id,
                                count: {
                                    listCount: resp[0],
                                    approvalCount: resp[1],
                                    taskGroupCount: resp[2],
                                    eodCount: resp[3]
                                }
                            }
                            // console.log("=============count===============", count);
                            AppletCount.push(count);
                            length++;
                            if (length == wRes.length) {
                                console.log('lrngths', length,wRes.length)
                                return res.json(AppletCount);
                            }
                        })

                    });
                    // return Promise.all(promise1).then(response => {
                    //     console.log("promise returned");
                    //     return res.json(AppletCount)

                    // })
                    // return AppletCount;
                    ;
                })

            })



        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
}

export = ProfileController;