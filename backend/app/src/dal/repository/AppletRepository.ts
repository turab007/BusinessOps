import IAppletModel = require("./../../model/interfaces/IAppletModel");
import ModuleSchema = require("./../dataAccess/schemas/ModuleSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * AppletRepository 
 * 
 * @class AppletRepository
 */
class AppletRepository extends RepositoryBase<IAppletModel> {

    constructor() {
        super(ModuleSchema);
    }

    create(item: IAppletModel) {
        item.module_type = 'Applet';
        return super.create(item);
    }

    update(_id: string, item: IAppletModel, opts = { runValidators: true, new: false, context: 'query' }) {
        item.module_type = 'Applet';
        return super.update(_id, item, opts);
    }

    count(cond?: Object) {
        let condition = this.prepareBasicCondition(cond);
        return super.count(condition);
    }

    find(cond: Object) {
        let condition = this.prepareBasicCondition(cond);
        return super.find(condition)
    }

    findAllByAttributes(cond: Object) {
        let condition = this.prepareBasicCondition(cond);
        return super.findAllByAttributes(condition)
    }


    findByAttribute(cond: Object) {
        let condition = this.prepareBasicCondition(cond);
        return super.findByAttribute(condition)
    }

    aggregate(cond: Object) {
        return super.aggregate(cond);
    }

    findLatestRecord() {
        return super._model.findOne({ 'module_type': 'Applet' }, {}, { sort: { 'created_at': -1 } })
    }
    /**
     * Prepare basic condition for applet
     * @param cond 
    */
    private prepareBasicCondition(cond?: Object) {
        if (cond) {
            cond['module_type'] = 'Applet';
        }
        else {
            cond = { 'module_type': 'Applet' }
        }
        return cond;
    }

}

Object.seal(AppletRepository);

export = AppletRepository;