/// <reference path="_all.d.ts" />
"use strict";
import * as express from "express";
import { MiddlewaresBase } from "./src/config/middlewares/base/MiddlewaresBase";
import Constants = require('./src/config/constants/Constants');

/**
 * Server class, the main entry point/middleware (express).
 *
 * @class Server
 */
class Server {

    /**
     * Express applicaton 
     */
    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();
    }

    /**
     * Configure application. 
     * This method will call "MiddlewaresBase.configuration" funciton. All base configurations are located there. 
     * Along with the routes utilization in app.
     *
     * @class Server
     * @method config
     * @return void
     */
    private config() {

        this.app.use(MiddlewaresBase.configuration)

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });

        this.errorHandler();
    }

    /**
     * Handle error.
     * 
     * @class Server
     * @method errorHandler
     * @return void
     */
    private errorHandler() {

        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

            if (err.stack && Constants.devEnvironments === true) {
                console.error(err, err.stack);
            }

            return res.status(err.status || 500).send({
                message: err.message || err.name || err
            });

        });
    }
}

var server = Server.bootstrap();
module.exports = server.app;