import IUserModel = require("./../../model/interfaces/IUserModel");
import UserSchema = require("./../dataAccess/schemas/UserSchema");
import RepositoryBase = require("./base/RepositoryBase");

class UserRepository extends RepositoryBase<IUserModel> {

    constructor() {
        super(UserSchema);
    }

    public getUserByUserId(user_id: string) {
        //:TODO prmoise refinement
        this._model.findOne({ user_id: user_id }, 'user_id first_name last_name password_hash');
    }
}

Object.seal(UserRepository);
export = UserRepository;