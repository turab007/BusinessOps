import { IListItemModel } from "./../../model/interfaces/barrel";
import ListItemSchema = require("./../dataAccess/schemas/ListItemSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * ListItemRepository 
 * 
 * @class ListItemRepository
 */
class ListItemRepository extends RepositoryBase<IListItemModel> {

    constructor() {
        super(ListItemSchema);
    }
}
export = ListItemRepository;