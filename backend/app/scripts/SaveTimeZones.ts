"use strict";
import _ = require('lodash-node');
import Promise = require('bluebird');
import timezonesJson = require("timezones.json");

import DataAccess = require("./../src/dal/dataAccess/DataAccess");
import ITimeZoneModel = require('../src/model/interfaces/ITimeZoneModel');
import { TimeZoneModel } from "./../src/model/barrel/";

/**
 * TimeZoneScript class, the main entry point/middleware (express).
 * Will import all the timezones
 * @class TimeZoneScript
 */
class TimeZoneScript {
    private _timeZoneModel: TimeZoneModel;

    protected mongoose = DataAccess.mongooseInstance;

    /**
       * Bootstrap the application.
       *
       * @class TimeZoneScript
       * @method bootstrap
       * @static
       * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
       */
    public static bootstrap(): TimeZoneScript {
        return new TimeZoneScript();
    }

    /**
   * Constructor.
   *
   * @class TimeZoneScript
   * @constructor
   */
    constructor() {
        console.log("Start Import TimeZones... ");

        this._timeZoneModel = new TimeZoneModel();


        this.saveZones().then(result => {

            this.closeConnection();

        });

    }

    public saveZones() {
        return Promise.each(timezonesJson, (zone) => {

            let zoneRec: ITimeZoneModel = {
                name: zone.value,
                abbr: zone.abbr,
                offset: zone.offset,
                isdst: zone.isdst,
                description: zone.text,
                utc: zone.utc,
            }

            // Check zone exists or not
            return this._timeZoneModel.findByAttribute({ name: zone.value }).then(result => {
                // if existed 
                if (result) {
                    return this._timeZoneModel.update(result._id, zoneRec).then(updateResult => {
                        return updateResult;
                    })
                }
                else {
                    return this._timeZoneModel.create(zoneRec).then(createdResult => {
                        return createdResult;

                    })
                }
            })

        })
    }


    private closeConnection() {
        console.log("Closing Mongoose connection");
        this.mongoose.connection.close();
    }

    /**
     * Handle error.
     * 
     * @class TimeZoneScript
     * @method errorHandler
     * @return void
     */
    private errorHandler() {


    }
}

//For Testing following script can be used

/**
*  
    _.forEach(timezonesJson, function (timezone) {
           console.log(timezone);
   });
* 
*/


var timeZoneScript = TimeZoneScript.bootstrap();
module.exports = timeZoneScript;

/**
 * To run this script use run this line on terminal
 * npm run timezones_seed
 */