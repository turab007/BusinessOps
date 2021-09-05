import * as express from "express";
import DataAccess = require("./../dal/dataAccess/DataAccess");
import IUserModel = require("./../model/interfaces/IUserModel");
import UserModel = require("./../model/UserModel");
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import { EmployeeModel } from '../model/EmployeeModel';

import { generateActivationKey, sendConfirmationEmail } from '../helpers/User.Helper';
//Load the request module
var request = require('request');
var mongoose = require('mongoose');


/**
 * User Controller
 * 
 * @class UserController
 */
class UsersController extends BaseController {



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
            console.log(req.query);
            let userModel = new UserModel();
            userModel.search({}, req.query).then((result) => {

                // Get total count
                userModel.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        users: result,
                        totalCount: totalCount
                    }

                    return res.json(returnResult);
                });


            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    public getUsers(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            console.log(req.query);
            let userModel = new UserModel();
            console.log('this is query', req.query);
            req.query['select'] = ["first_name", "last_name","user_id"];
            userModel.search({}, req.query).then((result) => {

                // Get total count
                userModel.count({}, req.query).then(totalCount => {
                    let returnResult = {
                        users: result,
                        totalCount: totalCount
                    }
                    // console.log(result); 

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
            let userModel = new UserModel();

            userModel.findById(_id).then((result) => {
                console.log(result.fullname);
                res.json(result);
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
    public getLoggedInUser(req, res: express.Response, next: express.NextFunction): void {
        try {
            let current_user = req.session.current_user;
            current_user.password_hash = current_user.work_spaces = null;
            res.json(current_user);
        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    /**
     * 
     * View single record by any attribute
     * 
     * @method view
     * @param req 
     * @param res 
     * @param next 
     */
    public view_by_attribute(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {


            var _attr: string = req.params.attr;
            var _attrValue: string = req.params.attr_value;
            // var _id: string = req.params.id;
            var userModel = new UserModel();
            var cond = {};

            cond[_attr] = _attrValue

            if (req.params.id && req.params.id != '') {
                cond['_id'] = { $ne: req.params.id.toString() }
            }

            userModel.findByAttribute(cond).then((result) => {
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
            let errorMessages = [];

            let User: IUserModel = <IUserModel>req.body;
            User.activation_token = generateActivationKey();
            User.status = false; // Todo:Low (need to set default from IUserModel)
            User.is_admin = true // PCM : because user wont be able to view his profile
            let userModel = new UserModel();
            //for now these requirements not to be entertained
            /*
                let userRoles = req.body.roles;
                let userBusinessGroups = req.body.businessGroups;
            */
            userModel.create(User).then((result) => {
                // sending email in valid response
                // TODO:low:17May17: For now I am unable to map result to IUserModel. It should be some kind of casting/maping like result = <IRoleModel>result instead of assigning the values manually in other variable.
                let userObj = {
                    first_name: result.first_name,
                    last_name: result.last_name,
                    user_id: result.user_id,
                    status: result.status,
                    is_admin: result.is_admin,
                    is_employee:result.is_employee,
                    _id: result._id,
                    email_sent: false
                };
                return sendConfirmationEmail(result, req.headers.origin).then(resultEmail => {
                    console.log("==================================");
                    console.log(resultEmail)
                    userObj.email_sent = resultEmail.accepted.length > 0 ? true : false
                    res.json(userObj);

                }).catch(errorEmail => {
                    console.log(errorEmail);
                    userObj.email_sent = false
                    res.json(userObj);
                })
            }).catch(error => {

                return next(ErrorMessages.modelValidationMessages(error));
            })

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

            let User: IUserModel = <IUserModel>req.body;

            let _id: string = req.params._id;
            let userModel = new UserModel();
            //for now these requirements not to be entertained
            /*
                let userRoles = req.body.roles;
                let userBusinessGroups = req.body.businessGroups;
            */

            userModel.update(_id, User).then((result) => {
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
     * 
     * Delete single record.
     * 
     * @param req
     * @param res 
     * @param next 
     */
    public delete(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {

            let _id: string = req.params._id;
            let userModel = new UserModel();

            userModel.delete(_id).then((result) => {

                return res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }
    /**
     * TODO: low (take this logic to model level)
     * @param req 
     * @param res 
     * @param next 
     */
    public autoComplete(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            let userModel = new UserModel();
            let not_in_ids = req.query.filter_not_in._id != '' ? req.query.filter_not_in._id.split(',') : [];
            not_in_ids = userModel.stringIdstoMongoIds(not_in_ids);

            let cond = [
                {
                    $project: {
                        name: { $concat: ["$first_name", " ", "$last_name"] },
                    }
                },
                {
                    $match: {
                        $and: [
                            { name: new RegExp(req.query.filter.name, 'i') },
                            { _id: { $nin: not_in_ids } },
                        ]
                    },

                },
            ];
            userModel.aggregate(cond).then((result) => {
                return res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
    /**
     * Get Selected users from array
     * @param req 
     * @param res 
     * @param next 
     */
    public getSelectedUsers(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let userModel = new UserModel();
            let ids = req.query.filter._ids != '' ? req.query.filter._ids.split(',') : [];

            userModel.findAllByIds(ids).then((result) => {
                return res.json(result);
            }).catch(next);

        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }


    //TODO MOVE TO EMPLOYEECONTROLLER

    public authenticateGitHub(req, res: express.Response, next: express.NextFunction) {
        try {
            let code = req.body.code;

            console.log('inside user authenticate', code);
            let body = {
                "client_id": "461e2b6455eaaa0ff0a1",
                "client_secret": "71099acca9128d91748670b24e18a40897c71428",
                "code": code
            };
            //Lets configure and request
            request({
                url: 'https://github.com/login/oauth/access_token', //URL to hit
                method: 'POST', // specify the request type
                headers: { // speciyfy the headers
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: Buffer.from(JSON.stringify(body)),
            }, function (error, response, body) {
                if (error) {
                    console.log('========error is=========', error);
                    // return error;
                } else {
                    console.log(response.statusCode, body);
                    // return response.body;
                }
                new EmployeeModel().findByAttribute({ 'user':req.session.current_user._id }).then(user => {
                
                    console.log("============this is found user==================",user);
                    let emp = {
                        'github_token':
                        {
                            'value': 'bearer ' + JSON.parse(response.body).access_token
                        }
                    }
                    new EmployeeModel().updateToken(user._id, emp).then(answer => {
                        console.log("==============this is answer===============", answer);
                    }, error => {
                            ErrorMessages.errorHandler(error, next)
                        })
                })
                return res.json(response);
            });

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    //TODO MOVE TO EMPLOYEECONTROLLER

    public authenticateGitLab(req, res: express.Response, next: express.NextFunction) {
        try {
            let code = req.body.code;

            console.log('inside user authenticate GitLab', code);
            let body = {
                "client_id": "012d22ca117b19fd214d1e9791f4b29f5d116752c2645b258186925fb0619ca0",
                "client_secret": "273db911b3d77fbc2e4c2cb5e016baf9fca39fe94b84398109eddf6bb9288018",
                "code": code,
                "redirect_uri": "http://dev-gc.vteamslabs.com/gitlabcallback",
                "grant_type": "authorization_code"
            };
            //Lets configure and request
            request({
                url: 'https://gitlab.vteamslabs.com/oauth/token', //URL to hit
                method: 'POST', // specify the request type
                headers: { // speciyfy the headers
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: Buffer.from(JSON.stringify(body)),
            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                    // return error;
                } else {
                    console.log(response.statusCode, body);

                    request({
                        url: 'https://gitlab.vteamslabs.com/api/v4/user/',
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + JSON.parse(response.body).access_token,
                            'User-Agent': 'Request'
                        },

                    }, function (error1, response1, body1) {
                        if (error1) {
                            console.log(error1);
                        }
                        else {
                            console.log('=================latest response===================', response1.statusCode, body1)
                        }

                        new EmployeeModel().findByAttribute({ 'user': req.session.current_user._id }).then(user => {
                            let emp = {
                                'gitlab_token':
                                {
                                    'value': 'bearer ' + JSON.parse(response.body).access_token,
                                    'id': JSON.parse(body1).id
                                }
                            }
                            new EmployeeModel().updateToken(user._id, emp).then(answer => {
                                console.log("==============this is answer===============", answer);
                            })
                        })

                    })
                    // return response.body;
                }
                // return response;
                return res.json(response);
            });

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }


}
export = UsersController;    