import * as express from "express";
import * as bodyParser from "body-parser";
import expressJWT = require('express-jwt');

import Constants = require('../../../config/constants/Constants');
import RBAC = require("../../../controllers/RBAC");
import Session = require("../../../controllers/Session");

import { MethodOverride } from "./../MethodOverride";
import { BaseRoutes } from "./../../routes/base/BaseRoutes";
import { getUserPayLoad } from '../../../helpers/User.Helper';
import UserModel = require("./../../../model/UserModel");

class MiddlewaresBase {

    static get configuration() {
        var app = express();
        app.use(bodyParser.json());

        //mount query string parser
        app.use(bodyParser.urlencoded({ extended: true }));

        //TODO:low: Check for production mode.
        app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
            res.header("Access-Control-Allow-Origin", req.get('Origin'));
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");
            // TODO:low: Somehow system is crashing on following line of code because of second 'true' parameter.
            // res.header('Access-Control-Allow-Credentials', true);

            // TODO:low: following code is for handeling the prerequest. Discuss it and fix it if it is not proper solution
            
            if ('OPTIONS' == req.method) {
                res.status(200).send();
            }
            else {
               
                //PCM: Low ( for managing created by and updated by), we assume POST is new and PUT is updated
                if(req.method=="PUT" && req.headers.authorization){
                    //updated case
                    getUserPayLoad(req.headers.authorization,new UserModel()).then(user=>{
                        req.body.updated_by = user._id;
                        next();
                    })
                }
                else if (req.method == "POST" && req.headers.authorization){
                    //create new case
                    getUserPayLoad(req.headers.authorization,new UserModel()).then(user=>{
                        req.body.created_by = user._id;
                        req.body.updated_by = user._id;
                        next();
                    })
                    
                }
                else {
                     next();
                }
                
               
            }
            // next();
        });

        // Token verification
        app.use(expressJWT({ secret: Constants.jwtTokenSecret }).unless({ path: Constants.publicActions }));

        // Role Access Authentication
        app.use(new RBAC().authenticate);

        //set user
        app.use(new Session().setUser)

        // app.use(MethodOverride.configuration());
        app.use(new BaseRoutes().routes);

        // set the view engine to ejs
        app.set('view engine', 'ejs');


        return app;
    }
}

Object.seal(MiddlewaresBase);
export { MiddlewaresBase };
