/// <reference path="../../_all.d.ts" />
import Promise = require("bluebird");
import _ = require('lodash-node');

import OpportunityRepository = require("./../dal/repository/OpportunityRepository");
import IOpportunityModel = require("./interfaces/IOpportunityModel");
import { ContactModel } from "./barrel/";
import BaseModel = require("./base/BaseModel");

/**
 * Opportunity Model
 * 
 * @class OpportunityModel
 */
class OpportunityModel extends BaseModel<IOpportunityModel> {

    private _opportunityRepository: OpportunityRepository;

    constructor() {
        super(new OpportunityRepository());
        this._opportunityRepository = this._repo;
    }
    /**
     * Create with relations
     * @param item 
     * @param intersted_in 
     */
    public createWithRelations(item: IOpportunityModel, intersted_in?: any[]) {

        return this.create(item).then(result => {
            //creating relations here
            let p1 = result
            // let p2 = new LeadTechnologyModel().createLeadTechnologies(result._id, item.intersted_in);
            return Promise.all([p1]).then(resPromise => {
                return this.getMergedWithHasManyRelations(resPromise);
            });


        }).then(error => {
            return error;
        });
    }

    public updateWithRelations(_id: string, item: IOpportunityModel, intersted_in?: any[]) {

        let p1 = this.update(_id, item);
        // can  be in future 
        /*
        let p2 = new LeadTechnologyModel().deleteTechnologiesIfNotInAry(_id, intersted_in).then(delResult => {
            // Create submitted interested technologies.
            return new LeadTechnologyModel().createLeadTechnologies(_id, item.intersted_in);
        });
        */

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
        //let p2 = new LeadTechnologyModel().retrieveByLeadId(_id);

        return Promise.all([p1]).then(resPromise => {
            return this.getMergedWithHasManyRelations(resPromise);
        });
    }
    /**
     * a helper method that will be used to merge all relations when require  the data
     * @param resPromise 
     */
    private getMergedWithHasManyRelations(resPromise) {

        let opportunityRes = this.getMergeWithBelongsToRelations(_.first(resPromise));

        /**
         * if you dont want above then only use this 
         * let opportunityRes = _.first(resPromise).toJSON();
         */
         
        return opportunityRes.then(res => {
            //--- will be used in future
            //res['intersted_in'] = resPromise[1] ? _.map(resPromise[1], 'tag_id') : [];
            return res;
        })


        // return opportunityRes;
    }
    /**
     * get With all belongs to relations
     * @param opportunityPromise 
     */
    private getMergeWithBelongsToRelations(opportunity) {
        let p1 = new ContactModel().findById(opportunity.contact_id);
        return Promise.all([opportunity, p1]).then(resPromise => {
            let opportunityRes = opportunity.toJSON();
            opportunityRes['contact_id_title'] = resPromise[1] ? resPromise[1].first_name : '';
            return opportunityRes;
        });
    }
    /**
     *
     * @param _id 
     */
    deleteWithRelations(_id: string) {
        let p1 = this.delete(_id);
        //deleting technologies ([] for deleting all technologies against opportunity)
        //---- will be used in future if needed
        //let p2 = new LeadTechnologyModel().deleteTechnologiesIfNotInAry(_id, []);

        return Promise.all([p1]).then(resPromise => {
            return _.first(resPromise);
        });

    }
}

Object.seal(OpportunityModel);
export =  OpportunityModel;