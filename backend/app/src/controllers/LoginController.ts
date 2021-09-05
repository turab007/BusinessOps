import * as express from "express";


import IUserModel = require("./../model/interfaces/IUserModel");
import UserModel = require("./../model/UserModel");
import ErrorMessages = require('../config/constants/Error.Messages');
import BaseController = require('./base/BaseController');
import { generateResetPasswordToken, sendResetPasswordEmail } from '../helpers/User.Helper'
/**
 * LoginController
 * @class LoginController
 */
class LoginController extends BaseController {

    public login(req: express.Request, res: express.Response, next: express.NextFunction): void {

        try {
            var user_id: string = req.body.user_id;
            var password: string = req.body.password;
            console.log(password);

            var model = new UserModel();

            model.login(user_id,password).then((result) => {

                if (!result) {
                    return next(ErrorMessages.invalidLogin());
                }
           
                res.json(result);

            }).catch(next);
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

    public logout(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log('---logout--')
        res.json({});
    }
    /**
     * For verification of user from confrimation token
     * @param req 
     * @param res 
     * @param next 
     */
    public verifyTokenAndActivateUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            console.log(req.body.confirmation_token)
            new UserModel().verifyAndActivate(req.body.confirmation_token).then(result => {
                if (result) {
                    res.json(result);
                }
                else {
                    throw null;
                }

            }).catch(e => {
                return next(ErrorMessages.invalidToken());
            });

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
    /**
     * Generate the email from found email address from database
     * @param req 
     * @param res 
     * @param next 
     */
    public forgotPassword(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            new UserModel().verifyUserAndSetPasswordToken(req.body.user_id, req.headers.origin).then(result => {
                if (result) {
                    res.json(result);
                }
                else {
                    throw null;
                }

            }).catch(e => {
                return next(ErrorMessages.invalidEmail());
            });
        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
    /**
     * For verifying reset token request it is fake or not
     * @param req 
     * @param res 
     * @param next 
     */
    public verifyResetToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            new UserModel().verifyResetPasswordToken(req.body.password_reset_token).then(result => {
                if (result) {
                    res.json(result);
                }
                else {
                    throw null;
                }
            }).catch(e => {
                return next(ErrorMessages.invalidToken());
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
    public resetPassword(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            console.log(req.body);
            new UserModel().verifyAndResetPassword(req.body.password_reset_token, req.body.new_password, req.body.confirm_new_password).then(result => {
                console.log(result);
                console.log('controller');
                if (result) {
                    res.json(result);
                }
                else {
                    throw null;
                }
            }).catch(e => {
                return next(ErrorMessages.invalidToken());
            });

        }
        catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }

}

export = LoginController;    