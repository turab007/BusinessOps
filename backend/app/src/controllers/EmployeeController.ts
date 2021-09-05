import * as express from "express";
import { _ } from "lodash-node";
import Promise = require('bluebird');
import moment = require('moment');

import { IEmployeeModel } from "./../model/interfaces/barrel/";
import UserModel = require("./../model/UserModel");
import { EmployeeModel } from "./../model/barrel";

import Constants = require('../config/constants/Constants');
import BaseController = require('./base/BaseController');
import ErrorMessages = require('../config/constants/Error.Messages');
//Load the request module
var request = require('request');

class EmployeeController extends BaseController {


    /**
     *  List all records.
     * @param req 
     * @param res 
     * @param next 
     */
    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let cond = {
            }
            var model = new EmployeeModel();

            model.search(cond, req.query, 'updated_at').populate('created_by').populate('user').then((result) => {
                // Get total count
                model.count(cond, req.query).then(totalCount => {
                    let returnResult = {
                        employees: result,
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

            let model = new EmployeeModel();
            //sort({ "comments.created_at": -1 })
            model.findById(_id).populate('created_by').populate('updated_by').populate('user').then((result) => {
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
            let employee: IEmployeeModel = <IEmployeeModel>req.body;
            new UserModel().findById(employee.user).then(user => {
                if (user) {
                    console.log("this is res", user)
                    let model = new EmployeeModel();
                    model.create(employee).then((result) => {
                        res.json(result);
                    }).catch(next);
                }
                else {
                    return next(ErrorMessages.notFound());
                }
            })

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
            var employee: IEmployeeModel = <IEmployeeModel>req.body;

            var model = new EmployeeModel();

            model.update(_id, employee).then((result) => {
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
            var model = new EmployeeModel();

            model.delete(_id).then((result) => {
                return res.json(result);
            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);

        }
    }

    public getGitHubRepos(req, res: express.Response, next: express.NextFunction) {

        let repos = [];
        let result = {};

        try {
            let _empId = req.params._empId;
            new EmployeeModel().findById(_empId).then(emp => {
                if (emp.github_token) {

                    console.log("==========token============", typeof emp.github_token.value);
                    //Lets configure and request
                    request({
                        url: 'https://api.github.com/user/repos', //URL to hit
                        method: 'GET', // specify the request type
                        headers: { // speciyfy the headers
                            'Authorization': emp.github_token.value,
                            'Accept': 'application/json',
                            'User-Agent': 'Request'
                        }
                    }, function (error, response, body) {
                        if (error) {
                            console.log(error);
                            // return error;
                        } else {
                            console.log(response.statusCode, body);
                            repos = JSON.parse(body);
                            result = {
                                repositories: repos,
                                totalCount: repos.length
                            }
                            // console.log("====================now we get this===================",repos);
                            // return response.body;
                        }
                        // return response;
                        return res.json(result);
                    });
                }
            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }


    public getGitHubBanches(req, res: express.Response, next: express.NextFunction) {

        let repos = [];
        let result = {};


        try {
            let _empId = req.params._empId;
            let _owner = req.params._owner;
            let _repo = req.params._repo;

            console.log("owner and repo ", _owner, _repo);

            new EmployeeModel().findById(_empId).then(emp => {
                console.log("Employee is ", emp);
                if (emp.github_token) {

                    //Lets configure and request
                    request({
                        url: 'https://api.github.com/repos/' + _owner + '/' + _repo + '/branches', //URL to hit
                        method: 'GET', // specify the request type
                        headers: { // speciyfy the headers
                            'Authorization': emp.github_token.value,
                            'Accept': 'application/json',
                            'User-Agent': 'Request'
                        }
                    }, function (error, response, body) {
                        if (error) {
                            console.log(error);
                            // return error;
                        } else {
                            console.log(response.statusCode, body);
                            repos = JSON.parse(body);
                            result = {
                                branches: repos,
                                totalCount: repos.length
                            }
                            // console.log("====================now we get this===================",repos);
                            // return response.body;
                        }
                        // return response;
                        return res.json(result);
                    });
                }
            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }

    public getGitHubCommits(req, res: express.Response, next: express.NextFunction) {

        // console.log("Get gitlab repos is working");
        let commits = [];
        let result = {};

        try {
            let _empId = req.params._empId;
            let _repo = req.params._repo;
            let _branch = req.params._branch;
            let _owner = req.params._owner;
            let _since = req.params._since;
            let _until = req.params._until;

            console.log("inside github commits",_empId,_owner,_repo,_branch);

            new EmployeeModel().findById(_empId).then(emp => {
                if (emp.github_token) {

                    console.log("==========token============", emp.github_token.value);
                    //Lets configure and request
                    request({
                        // url: 'https://gitlab.vteamslabs.com/api/v4/users/'+emp.gitlab_token.id+'/projects', //URL to hit
                        url: 'https://api.github.com/repos/' + _owner + '/' + _repo + '/commits', //URL to hit
                        method: 'GET', // specify the request type
                        headers: { // speciyfy the headers
                            'Authorization': emp.github_token.value,
                            'Accept': 'application/json',
                            'User-Agent': 'Request'
                        },
                        transport_method: 'query',
                        qs: {
                            // {
                            //     name:'ref_name',
                            //     value:_branch
                            // }
                            'sha': _branch
                            // 'since':_since,
                            // 'until':_until

                        }
                    }, function (error, response, body) {
                        if (error) {
                            console.log(error);
                            // return error;
                        } else {
                            console.log(response.statusCode, body);
                            commits = JSON.parse(body);
                            result = {
                                commits: commits,
                                totalCount: commits.length
                            }
                            // console.log("====================now we get this===================",repos);
                            // return response.body;
                        }
                        // return response;
                        return res.json(result);
                    });
                }
                else {
                    console.log("if not working");
                    return ErrorMessages.authenticationFail();
                }

            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }


    public getGitLabRepos(req, res: express.Response, next: express.NextFunction) {

        // console.log("Get gitlab repos is working");
        let repos = [];
        let result = {};

        try {
            let _empId = req.params._empId;
            new EmployeeModel().findById(_empId).then(emp => {
                if (emp.gitlab_token && emp.gitlab_token.id) {

                    console.log("==========token============", emp.gitlab_token.value);
                    //Lets configure and request
                    request({
                        // url: 'https://gitlab.vteamslabs.com/api/v4/users/'+emp.gitlab_token.id+'/projects', //URL to hit
                        url: 'https://gitlab.vteamslabs.com/api/v4/projects/', //URL to hit
                        method: 'GET', // specify the request type
                        headers: { // speciyfy the headers
                            'Authorization': emp.gitlab_token.value,
                            'Accept': 'application/json',
                            'User-Agent': 'Request'
                        }
                    }, function (error, response, body) {
                        if (error) {
                            console.log(error);
                            // return error;
                        } else {
                            console.log(response.statusCode, body);
                            repos = JSON.parse(body);
                            result = {
                                repositories: repos,
                                totalCount: repos.length
                            }
                            // console.log("====================now we get this===================",repos);
                            // return response.body;
                        }
                        // return response;
                        return res.json(result);
                    });
                }
                else {
                    console.log("if not working");
                    return ErrorMessages.authenticationFail();
                }

            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }
    public getGitLabCommits(req, res: express.Response, next: express.NextFunction) {

        // console.log("Get gitlab repos is working");
        let commits = [];
        let result = {};

        try {
            let _empId = req.params._empId;
            let _repoId = req.params._repoId;
            let _branch = req.params._branch;
            let _since = req.params._since;
            let _until = req.params._until;

            new EmployeeModel().findById(_empId).then(emp => {
                if (emp.gitlab_token && emp.gitlab_token.id) {

                    console.log("==========token============", emp.gitlab_token.value);
                    //Lets configure and request
                    request({
                        // url: 'https://gitlab.vteamslabs.com/api/v4/users/'+emp.gitlab_token.id+'/projects', //URL to hit
                        url: 'http://gitlab.vteamslabs.com/api/v4/projects/' + _repoId + '/repository/commits', //URL to hit
                        method: 'GET', // specify the request type
                        headers: { // speciyfy the headers
                            'Authorization': emp.gitlab_token.value,
                            'Accept': 'application/json',
                            'User-Agent': 'Request'
                        },
                        transport_method: 'query',
                        qs: {
                            // {
                            //     name:'ref_name',
                            //     value:_branch
                            // }
                            'ref_name': _branch
                            // 'since':_since,
                            // 'until':_until

                        }
                    }, function (error, response, body) {
                        if (error) {
                            console.log(error);
                            // return error;
                        } else {
                            console.log(response.statusCode, body);
                            commits = JSON.parse(body);
                            result = {
                                commits: commits,
                                totalCount: commits.length
                            }
                            // console.log("====================now we get this===================",repos);
                            // return response.body;
                        }
                        // return response;
                        return res.json(result);
                    });
                }
                else {
                    console.log("if not working");
                    return ErrorMessages.authenticationFail();
                }

            })

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }

    }
    public getGitLabBranches(req, res: express.Response, next: express.NextFunction) {

        let _repoId = req.params._repoId;
        let _empId = req.params._empId;

        let branches = [];
        let result = {};

        console.log("Repo id is ", _repoId);
        new EmployeeModel().findById(_empId).then(emp => {
            if (emp.gitlab_token) {
                request({
                    url: 'http://gitlab.vteamslabs.com/api/v4/projects/' + _repoId + '/repository/branches', //URL to hit
                    method: 'GET', // specify the request type
                    headers: { // speciyfy the headers
                        'Authorization': emp.gitlab_token.value,
                        'Accept': 'application/json',
                        'User-Agent': 'Request'
                    },
                    // transport_method: 'query',
                    // qs: {
                    //     // {
                    //     //     name:'ref_name',
                    //     //     value:_branch
                    //     // }
                    //     // 'ref_name':_branch
                    //     // 'since':_since,
                    //     // 'until':_until

                    // }
                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        // return error;
                    } else {
                        console.log(response.statusCode, body);
                        branches = JSON.parse(body);
                        result = {
                            branches: branches,
                            totalCount: branches.length
                        }
                        // console.log("====================now we get this===================",repos);
                        // return response.body;
                    }
                    // return response;
                    return res.json(result);
                });

            }
        })
    }
}

export = EmployeeController;


