import ICompanyModel = require("./../../model/interfaces/ICompanyModel");
import CompanySchema = require("./../dataAccess/schemas/CompanySchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * Company Repository 
 * 
 * @class CompanyRepository
 */
class CompanyRepository extends RepositoryBase<ICompanyModel> {

    constructor() {
        super(CompanySchema);
    }
}
export = CompanyRepository;