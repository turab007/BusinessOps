import { IListModel } from "./../../model/interfaces/barrel";
import ListSchema = require("./../dataAccess/schemas/ListSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * ListRepository 
 * 
 * @class ListRepository
 */
class ListRepository extends RepositoryBase<IListModel> {

    constructor() {
        super(ListSchema);
    }
}
export = ListRepository;