"use strict";
import _ = require('lodash-node');
import Promise = require('bluebird');
import DataAccess = require("./../src/dal/dataAccess/DataAccess");

import IAppletModel = require('../src/model/interfaces/IAppletModel');
import { AppletModel } from "./../src/model/barrel/";

/**
 * Purpose of this example to to create Personal Workspace for each user
 */
class AppletSeed {

    protected mongoose = DataAccess.mongooseInstance;

    private _appletModel: AppletModel;

    private _Applets: IAppletModel[] = [
        { name: 'Tasks', description: '', status: true, weight: 1, module_type: 'Applet' },
        { name: 'Approvals', description: '', status: true, weight: 2, module_type: 'Applet' },
        { name: 'Lists', description: '', status: true, weight: 3, module_type: 'Applet' },
        { name: 'EOD Reports', description: '', status: true, weight: 4, module_type: 'Applet' }
    ]


    public static bootstrap(): AppletSeed {

        return new AppletSeed();

    }

    /**
     * Constructor.
     *
     * @class AppletSeed
     * @constructor
    */
    constructor() {
        console.log("Applet seed ... ");

        this._appletModel = new AppletModel();

        this.InsertApplets().then(result => {
            this.closeConnection();
        });
    }


    private InsertApplets() {

        return Promise.each(this._Applets, (item => {
            
            return this._appletModel.create(item).then(res => {

                console.log(`Applet ${item.name} is created.`);

            }).catch(error => {
                return error;
            })
        }))
    }

    /**
     * close connections
    */
    private closeConnection() {
        console.log("Closing Mongoose connection");
        this.mongoose.connection.close();
    }
}
//running scripts
AppletSeed.bootstrap();


