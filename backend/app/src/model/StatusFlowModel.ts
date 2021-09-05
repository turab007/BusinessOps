/// <reference path="../../_all.d.ts" />
import StatusFlowRepository = require("./../dal/repository/StatusFlowRepository");
import IStatusFlowModel = require("./interfaces/IStatusFlowModel");
import BaseModel = require("./base/BaseModel");

/**
 * Status Flow Model
 * 
 * @class StatusFlowModel
 */
class StatusFlowModel extends BaseModel<IStatusFlowModel> {

    private _statusFlowRepository: StatusFlowRepository;

    constructor() {
        super(new StatusFlowRepository());
        this._statusFlowRepository = this._repo;
    }


}

Object.seal(StatusFlowModel);
export { StatusFlowModel };