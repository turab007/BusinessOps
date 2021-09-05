/// <reference path="../../_all.d.ts" />
import { _ } from "lodash-node"
import ListRepository = require("./../dal/repository/ListRepository");
import { IListModel, IListItemModel } from "./interfaces/barrel/";
import { AppletModel, ListItemModel } from "./barrel/";
import BaseModel = require("./base/BaseModel");

/**
 * List Model
 * 
 * @class ListModel
 */
class ListModel extends BaseModel<IListModel> {

    private _listRepository: ListRepository;

    constructor() {
        super(new ListRepository());
        this._listRepository = this._repo;
    }

    /**
     * 
     * @param item 
     */
    create(item: IListModel) {
        return super.create(item);
    }
    /**
     * 
     * @param _id 
     * @param model 
     */
    copy(_id: string, model: IListModel) {
        return this.create(model).then(list => {
            return new ListItemModel().findAllByAttributes({list_id:_id}).then(listItems=>
            {
      
                listItems.forEach(item => {
                    // console.log("==========my list items==============", item);
                    let obj={
                        name:item.name,
                        list_id:list._id,
                        weight:item.weight,
                        done: item.done,

                    }
                    // item.list_id=_id;
                    // delete item._id;
                    new ListItemModel().create(obj).then(res=>
                    {
                        return list;

                    });
                    return list;
                });
                return list;
            })
            // return this.findById(_id).populate('items').then(res => {
            //     let items = _.map(res.items, function (item) { item.list_id = list._id; return item })
            //     return new ListItemModel().createMany(items).then(itemsRes=>{
            //         return list;
            //     })
            // })
        })
    }

}

Object.seal(ListModel);
export { ListModel };