import IMailServerModel = require("./../../model/interfaces/IMailServerModel");
import MailServerSchema = require("./../dataAccess/schemas/MailServerSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * MailServerRepository 
 * 
 * @class MailServerRepository
 */
class MailServerRepository extends RepositoryBase<IMailServerModel> {

    constructor() {
        super(MailServerSchema);
    }
}
export = MailServerRepository;