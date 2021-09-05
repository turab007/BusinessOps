

import * as express from "express";
import { AppletModel } from "./../model/barrel";
import { _ } from "lodash-node";

import ErrorMessages = require('../config/constants/Error.Messages');
import Constants = require('../config/constants/Constants');

/**
 * Purpose of this class to check current applet is allowed against workSpace
 *
 */
class AppletAccessController {
    //controller constructor
    constructor()  {

    }
    public checkInstalled(req, res: express.Response, next: express.NextFunction) {
        try {
            
            var _wsId: string = req.params.ws;
            let cond = { work_spaces: { "$in": [_wsId] } };
            console.log("-----applet access-----");
            console.log(req.params);
            console.log(req.applet);

            new AppletModel().findAppletsByWorkSpace(_wsId).then(res => {
                let applets = _.map(res, "name");
                console.log(res);
                console.log("--------access---aplet--");
                if (_.includes(applets, req.applet)) {
                      
                    next();
                }
                else {
                    return next(ErrorMessages.forbidden);
                }
            })


        } catch (e) {
            return ErrorMessages.errorHandler(e, next);
        }
    }
}

export = AppletAccessController;    