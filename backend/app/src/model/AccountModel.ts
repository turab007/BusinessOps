/// <reference path="../../_all.d.ts" />
import Promise = require("bluebird");
import _ = require('lodash-node');

import AccountRepository = require("./../dal/repository/AccountRepository");
import IAccountModel = require("./interfaces/IAccountModel");
import { ContactModel, TagModel } from "./barrel/";

import UserModel = require("./UserModel");
import BaseModel = require("./base/BaseModel");

/**
 * Account Model
 * 
 * @class AccountModel
 */
class AccountModel extends BaseModel<IAccountModel> {

    private _accountRepository: AccountRepository;

    constructor() {
        super(new AccountRepository());
        this._accountRepository = this._repo;
    }
    /**
     * Create with relations
     * @param item 
     * @param intersted_in 
     */
    public createWithRelations(item: IAccountModel, intersted_in?: any[]) {
        item = this.beforeSave(item);
        return this.create(item).then(result => {
            //creating relations here
            let p1 = result
            return Promise.all([p1]).then(resPromise => {
                return this.getMergedWithHasManyRelations(resPromise);
            });


        }).then(error => {
            return error;
        });
    }

    public updateWithRelations(_id: string, item: IAccountModel, intersted_in?: any[]) {
        item = this.beforeSave(item);
        let p1 = this.update(_id, item);

        return Promise.all([p1]).then(resPromise => {
            return resPromise;
        });
    }
    /**
     * 
     * @param _id 
     */
    findByIdWithRelations(_id: string) {
        let p1 = this.findById(_id);
        // will be used in future

        return Promise.all([p1]).then(resPromise => {
            return this.getMergedWithHasManyRelations(resPromise);
        });
    }
    /**
     * a helper method that will be used to merge all relations when require  the data
     * @param resPromise 
     */
    private getMergedWithHasManyRelations(resPromise) {

        let accountRes = this.getMergeWithBelongsToRelations(_.first(resPromise));
        let p2 = new TagModel().findTechnologies(_.first(resPromise).intersted_in)
        let p3 = new UserModel().findAllByIds(_.first(resPromise).participants)

        /**
         * if you dont want above then only use this 
         * let accountRes = _.first(resPromise).toJSON();
         */
        return Promise.all([accountRes, p2, p3]).then(resFinal => {
            let res = _.first(resFinal);
            res['relatedTechnologies'] = resFinal[1];
            res['relatedParticipants'] = resFinal[2];
            return res;
        })


        // return accountRes;
    }
    /**
     * get With all belongs to relations
     * @param accountPromise 
     */
    private getMergeWithBelongsToRelations(account) {
        let p1 = new ContactModel().findById(account.contact_id);
        return Promise.all([account, p1]).then(resPromise => {
            let accountRes = account.toJSON();
            accountRes['contact_id_title'] = resPromise[1] ? resPromise[1].first_name : '';
            return accountRes;
        });
    }
    /**
     *
     * @param _id 
     */
    deleteWithRelations(_id: string) {
        let p1 = this.delete(_id);
        //deleting technologies ([] for deleting all technologies against account)
        //---- will be used in future if needed


        return Promise.all([p1]).then(resPromise => {
            return _.first(resPromise);
        });

    }
    /**
     * if company_type is existing then (company_name is NULL and vise versa)
     * if contact_type is existing then (contact_name is NULL and vise versa)
     * @param item 
    */
    private beforeSave(item: IAccountModel) {
        console.log(item);
        if (item.company_type == 'new') {
            item.company_id = null;
        }
        else if (item.company_type == 'existing') {
            item.company_name = null;
        }

        //now for contact
        if (item.contact_type == 'new') {
            item.contact_id = null;
        }
        else if (item.contact_type == 'existing') {
            item.contact_name = null;
        }
        return item;
    }
}

Object.seal(AccountModel);
export { AccountModel };