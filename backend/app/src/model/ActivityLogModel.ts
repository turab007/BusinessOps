/// <reference path="../../_all.d.ts" />
import { _ } from 'lodash-node'
import Promise = require('bluebird');
import ActivityLogRepository = require("./../dal/repository/ActivityLogRepository");
import { IActivityLogModel } from "./interfaces/IActivityLogModel";
import BaseModel = require("./base/BaseModel");

/**
 * 
 * Activity Log Model
 * 
 * @class ActivityLogModel
 */
class ActivityLogModel extends BaseModel<IActivityLogModel> {

    private _alRepository: ActivityLogRepository;

    constructor() {
        super(new ActivityLogRepository());
        this._alRepository = this._repo;
    }
}

Object.seal(ActivityLogModel);
export { ActivityLogModel };