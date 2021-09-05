import ILeadModel = require("./../../model/interfaces/ILeadModel");
import LeadSchema = require("./../dataAccess/schemas/LeadSchema");
import RepositoryBase = require("./base/RepositoryBase");

class LeadRepository extends RepositoryBase<ILeadModel> {

    constructor() {
        super(LeadSchema);
    }

}

Object.seal(LeadRepository);
export = LeadRepository;