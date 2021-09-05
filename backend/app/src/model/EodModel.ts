/// <reference path="../../_all.d.ts" />
import { _ } from 'lodash-node'
import Promise = require('bluebird');
import EodRepository = require("./../dal/repository/EodRepository");
import { IEodModel } from "./interfaces/IEodModel";
import BaseModel = require("./base/BaseModel");

/**
 * 
 * Activity Log Model
 * 
 * @class ActivityLogModel
 */
class EodModel extends BaseModel<IEodModel> {

    private _alRepository: EodRepository;

    constructor() {
        super(new EodRepository());
        this._alRepository = this._repo;
    }
    
}

Object.seal(EodModel);
export { EodModel };