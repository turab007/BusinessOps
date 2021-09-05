import ITagModel = require("./../../model/interfaces/ITagModel");
import TagSchema = require("./../dataAccess/schemas/TagSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * TagRepository 
 * 
 * @class TagRepository
 */
class TagRepository extends RepositoryBase<ITagModel> {

    constructor() {
        super(TagSchema);
    }
}
export = TagRepository;