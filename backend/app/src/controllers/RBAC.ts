import * as express from "express";

import ErrorMessages = require('../config/constants/Error.Messages');
import Constants = require('../config/constants/Constants');
import { RBACModel, ModuleModel, WorkSpaceModel, RoleModel } from "./../model/barrel/";
import UserModel = require('../model/UserModel');
import _ = require("lodash-node");

/**
 * RBAC controller 
 * 
 * @class RBAC
 */
class RBAC {

    /**
     * Authenticate user that user has permission to requested URL (controller/action) or not.
     * 
     * In this method we are using originalUrl to fetch our controller. 
     * 
     * i.e. /user/create/a/b/c : here user is our controller and create is our action.
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    authenticate(req, res: express.Response, next: express.NextFunction) {
        // return next();

        try {

            // TODO:low:16May17: Make this array to centerilzie part
            let url = req.originalUrl.split("?");
            if (_.includes(Constants.publicActions, url[0])) {
                console.log('-----exclude---');
                return next();
            }

            // Fetch/prepare controller and action name.
            let permissionArray = req.originalUrl.split('/');
            // console.log("this is permission array", permissionArray);
            let controllerName = permissionArray[1];
            console.log('============controller name====================', controllerName);
            let actionName = permissionArray[2];

            //LIST OF ALL CONTROLLER IN WORKSPACE MODULE
            let controllerList = ['lists', 'listItems', 'applets', 'approvals', 'eod', 'taskGroups', 'tasks']

            console.log('this is 3rd element', permissionArray[3]);
            //check if controller belongs to workspace
            if (permissionArray[3] && (controllerList.indexOf(controllerName) != -1)) {
                let query = permissionArray[3].split('?');

                //GET WORKSPACE ID
                let wsId = query[0];
                let role;
                console.log('=========this is wsId=======', wsId);
                // console.log('this is complete query', query);

                //GET WORSPACE FROM ITS ID
                new WorkSpaceModel().findById(wsId).then(ws => {
                    console.log('Workspace found');
                    console.log("array length", ws.user_role.length);
                    new UserModel().findByAttribute({ 'user_id': req.user.user_id }).then(user => {
                        console.log("both user objects", ws.created_by, user._id.toString());
                        if (ws.user_role.length > 0) {
                            if (ws.created_by == user._id.toString()) {
                                console.log("created by me");
                                return next()
                            }
                            else
                                //CHECK IF USER HAS ROLE IN WORKSPACE
                                ws.user_role.forEach(userRole => {
                                    console.log("checking user role", userRole._id, req.user);

                                    //CHECK IF USER IS CREATER OF WORKSPACE
                                    console.log("both user objects", ws.created_by, user._id.toString());

                                    if (userRole._id.toString() == user._id.toString()) {
                                        role = userRole.role;
                                        //GET WORKSPACE MODULE
                                        return new ModuleModel().findByAttribute({ 'name': 'Workspaces' }).then(wsModule => {
                                            // console.log('this is ws', wsModule);
                                            //CHECK PERMISSIONS
                                            return new RBACModel().checkWsPermission(req.user.user_id, controllerName, actionName, wsModule._id, role,ws._id).then(result => {
                                                if (result == true) {
                                                    return next();
                                                }
                                                else {
                                                    return next(ErrorMessages.forbidden);
                                                }
                                            });
                                        });
                                    }

                                });
                        }

                        else
                            if (user._id.toString() == ws.created_by) {
                                console.log("created by me");
                                return next();
                            }

                    });

                })
            }
            else {

                return next(); //REMOVE WHEN IMPLEMENTING CODE BELOW


                // // Check user has permission on req or not.
                // return new RBACModel().checkPermission(req.user.user_id, controllerName, actionName).then(result => {

                //     if (result == true) {
                //         return next();
                //     }
                //     else {
                //         return next(ErrorMessages.forbidden);
                //     }
                // });
            }

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
}

export = RBAC;    