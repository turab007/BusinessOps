/// <reference path="../../_all.d.ts" />
import Promise = require("bluebird");
import _ = require('lodash-node');

import ContactRepository = require("./../dal/repository/ContactRepository");
import IContactModel = require("./interfaces/IContactModel");
import { CompanyModel }from "./barrel/"
import BaseModel = require("./base/BaseModel");

/**
 * Contact Model
 * 
 * @class ContactModel
 */
class ContactModel extends BaseModel<IContactModel> {

    private _contactRepository: ContactRepository;

    constructor() {
        super(new ContactRepository());
        this._contactRepository = this._repo;
    }

   /**
    * 
    * @param _id 
    */
    findByIdWithRelations(_id: string) {
        let p1 = this.findById(_id);

        return Promise.all([p1]).then(resPromise => {
            return this.getMergedWithHasManyRelations(resPromise);
        });
    }

    /**
     * a helper method that will be used to merge all relations when require  the data
     * @param resPromise 
    */
    private getMergedWithHasManyRelations(resPromise) {
        let contactRes = this.getMergeWithBelongsToRelations(_.first(resPromise));
        return contactRes;
    }

     /**
     * get With all belongs to relations
     * @param leadPromise 
     */
    private getMergeWithBelongsToRelations(contact) {
        let p1 = new CompanyModel().findById(contact.company);
        return Promise.all([contact, p1]).then(resPromise => {
            let contactRes = contact.toJSON();
            contactRes['company_title'] = resPromise[1] ? resPromise[1].name: '';
            return contactRes;
        });
    }


}

Object.seal(ContactModel);
export { ContactModel };