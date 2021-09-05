import IModuleModel = require("./../../model/interfaces/IModuleModel");
import ModuleSchema = require("./../dataAccess/schemas/ModuleSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * ModuleRepository 
 * 
 * @class ModuleRepository
 */
class ModuleRepository extends RepositoryBase<IModuleModel> {

    constructor() {
        super(ModuleSchema);
    }
}

Object.seal(ModuleRepository);

export = ModuleRepository;