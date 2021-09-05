/// <reference path="../../_all.d.ts" />
import TimeZoneRepository = require("./../dal/repository/TimeZoneRepository");
import ITimeZoneModel = require("./interfaces/ITimeZoneModel");
import BaseModel = require("./base/BaseModel");

/**
 * TimeZone Model
 * @class TimeZoneModel
 */
class TimeZoneModel extends BaseModel<ITimeZoneModel> {

    private _timeZoneRepository: TimeZoneRepository;

    

    constructor() {
        super(new TimeZoneRepository());
        this._timeZoneRepository = this._repo;
    }
}

Object.seal(TimeZoneModel);
export { TimeZoneModel };