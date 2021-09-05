/// <reference path="../../_all.d.ts" />
import ListItemRepository = require("./../dal/repository/ListItemRepository");
import { IListItemModel } from "./interfaces/barrel/";
import BaseModel = require("./base/BaseModel");

/**
 * ListItem Model
 * 
 * @class ListItemModel
 */
class ListItemModel extends BaseModel<IListItemModel> {

    private _listRepository: ListItemRepository;

    constructor() {
        super(new ListItemRepository());
        this._listRepository = this._repo;
    }
   
}

Object.seal(ListItemModel);
export { ListItemModel };