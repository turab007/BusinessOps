/// <reference path="../../_all.d.ts" />
import CompanyRepository = require("./../dal/repository/CompanyRepository");
import ICompanyModel = require("./interfaces/ICompanyModel");
import BaseModel = require("./base/BaseModel");

/**
 * Company Model
 * 
 * @class CompanyModel
 */
class CompanyModel extends BaseModel<ICompanyModel> {

    private _companyRepository: CompanyRepository;

    constructor() {
        super(new CompanyRepository());
        this._companyRepository = this._repo;
    }


}

Object.seal(CompanyModel);
export { CompanyModel };