import * as express from "express";
import UserModel = require("./../model/UserModel");

import ErrorMessages = require('../config/constants/Error.Messages');
import Constants = require('../config/constants/Constants');

/**
 * Purpose of this class to store all the session variables in requests, and entertain it ,
 * Right now only done this for getting current user in request session
 */
class Session {

    setUser(req, res: express.Response, next: express.NextFunction) {
        try {
            if (req.user) {
                return new UserModel().findByEmail(req.user.user_id).then(user => {
                    req.session = {current_user: user};
                    return next();
                })
            }
            else {
                return next();
            }


        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
}

export = Session;    