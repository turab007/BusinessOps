/// <reference path="../../_all.d.ts" />
import Promise = require("bluebird");
import _ = require('lodash-node');

import LeadRepository = require("./../dal/repository/LeadRepository");
import ILeadModel = require("./interfaces/ILeadModel");
import { ContactModel, TagModel } from "./barrel/";
import UserModel = require("./UserModel");
import BaseModel = require("./base/BaseModel");

/**
 * Lead Model
 * 
 * @class LeadModel
 */
class LeadModel extends BaseModel<ILeadModel> {

    private _leadRepository: LeadRepository;

    constructor() {
        super(new LeadRepository());
        this._leadRepository = this._repo;
    }
    /**
     * Create with relations
     * @param item 
     * @param intersted_in 
     */
    public createWithRelations(item: ILeadModel, intersted_in?: any[]) {
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

    public updateWithRelations(_id: string, item: ILeadModel, intersted_in?: any[]) {
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

        let leadRes = this.getMergeWithBelongsToRelations(_.first(resPromise));
        let p2 = new TagModel().findTechnologies(_.first(resPromise).intersted_in)
        let p3 = new UserModel().findAllByIds(_.first(resPromise).participants)

        /**
         * if you dont want above then only use this 
         * let leadRes = _.first(resPromise).toJSON();
         */
        return Promise.all([leadRes,p2,p3]).then(resFinal => {
            let res = _.first(resFinal);
            res['relatedTechnologies'] = resFinal[1];
            res['relatedParticipants'] = resFinal[2];
            return res;
        }) 


        // return leadRes;
    }
    /**
     * get With all belongs to relations
     * @param leadPromise 
     */
    private getMergeWithBelongsToRelations(lead) {
        let p1 = new ContactModel().findById(lead.contact_id);
        return Promise.all([lead, p1]).then(resPromise => {
            let leadRes = lead.toJSON();
            leadRes['contact_id_title'] = resPromise[1] ? resPromise[1].first_name : '';
            return leadRes;
        });
    }
    /**
     *
     * @param _id 
     */
    deleteWithRelations(_id: string) {
        let p1 = this.delete(_id);
        //deleting technologies ([] for deleting all technologies against lead)
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
    private beforeSave(item:ILeadModel){
        console.log(item);
        if(item.company_type=='new'){
            item.company_id = null;
        }
        else if(item.company_type=='existing'){
            item.company_name = null;
        }

        //now for contact
         if(item.contact_type=='new'){
            item.contact_id = null;
        }
        else if(item.contact_type=='existing'){
            item.contact_name = null;
        }
        return item;
    }
}

Object.seal(LeadModel);
export =  LeadModel;