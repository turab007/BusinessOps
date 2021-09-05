/// <reference path="../../_all.d.ts" />

import AppletRepository = require("./../dal/repository/AppletRepository");
import IAppletModel = require("./interfaces/IAppletModel");
import BaseModel = require("./base/BaseModel");

/**
 * Applet Model
 * 
 * @class AppletModel
 */
class AppletModel extends BaseModel<IAppletModel> {

    constructor() {
        super(new AppletRepository());
    }
    /**
     * Find those Applets who have following workSpaces
     * @param wsId 
    */
    public findAppletsByWorkSpace(wsId:string) {
        //'Technologies' (is a Tag data_type)
        let cond = {
            $and: [
                { 'work_spaces': { $exists: true } },
                { 'work_spaces': { $ne: null } },
                { 'work_spaces': { $in: [wsId] } },
            ]
        }
        console.log(wsId);
        return this.findAllByAttributes(cond).select('name _id').sort({ name: 'asc' }).then((result) => {
            console.log(result);
            return result;
        })
    }


}
export { AppletModel };