import IContactModel = require("./../../model/interfaces/IContactModel");
import ContactSchema = require("./../dataAccess/schemas/ContactSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * Contact Repository 
 * 
 * @class ContactRepository
 */
class ContactRepository extends RepositoryBase<IContactModel> {

    constructor() {
        super(ContactSchema);
    }
}
export = ContactRepository;