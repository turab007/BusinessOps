import IOpportunityModel = require("./../../model/interfaces/IOpportunityModel");
import OpportunitySchema = require("./../dataAccess/schemas/OpportunitySchema");
import RepositoryBase = require("./base/RepositoryBase");

class OpportunityRepository extends RepositoryBase<IOpportunityModel> {

    constructor() {
        super(OpportunitySchema);
    }

}

Object.seal(OpportunityRepository);
export = OpportunityRepository;