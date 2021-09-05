import IAccountModel = require("./../../model/interfaces/IAccountModel");
import AccountSchema = require("./../dataAccess/schemas/AccountSchema");
import RepositoryBase = require("./base/RepositoryBase");

class AccountRepository extends RepositoryBase<IAccountModel> {

    constructor() {
        super(AccountSchema);
    }

}

Object.seal(AccountRepository);
export = AccountRepository;