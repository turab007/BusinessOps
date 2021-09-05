/// <reference path="../../_all.d.ts" />
import { _ } from 'lodash-node'
import Promise = require('bluebird');
import EmployeeRepository = require("./../dal/repository/EmployeeRepository");
import { IEmployeeModel } from "./interfaces/IEmployeeModel";
import BaseModel = require("./base/BaseModel");

/**
 * 
 * Activity Log Model
 * 
 * @class ActivityLogModel
 */
class EmployeeModel extends BaseModel<IEmployeeModel> {

    private _alRepository: EmployeeRepository;

    constructor() {
        super(new EmployeeRepository());
        this._alRepository = this._repo;
    }

    updateToken(_id:string,model)
    {
        return this.findByIdAndUpdate(_id,model).then(result=>
        {
            console.log("this is what is got",result,"model is",model);
            return result;
        })

    }
    
}

Object.seal(EmployeeModel);
export { EmployeeModel };