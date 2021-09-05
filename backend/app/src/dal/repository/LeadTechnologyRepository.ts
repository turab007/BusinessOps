import ILeadTechnologyModel = require("./../../model/interfaces/ILeadTechnologyModel");
import LeadTechnologySchema = require("./../dataAccess/schemas/LeadTechnologySchema");
import RepositoryBase = require("./base/RepositoryBase");

class LeadTechnologyRepository extends RepositoryBase<ILeadTechnologyModel> {

    constructor() {
        super(LeadTechnologySchema);
    }

}

Object.seal(LeadTechnologyRepository);
export = LeadTechnologyRepository;