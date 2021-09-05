/// <reference path="../../_all.d.ts" />
import Promise = require('bluebird');
import _ = require('lodash-node');

import LeadTechnologyRepository = require("./../dal/repository/LeadTechnologyRepository");
import ILeadTechnologyModel = require("./interfaces/ILeadTechnologyModel");
import BaseModel = require("./base/BaseModel");

/**
 * LeadTechnology Model
 * 
 * @class LeadTechnologyModel
 */
class LeadTechnologyModel extends BaseModel<ILeadTechnologyModel> {

    private _leadTechRepository: LeadTechnologyRepository;

    constructor() {
        super(new LeadTechnologyRepository());
        this._leadTechRepository = this._repo;
    }

    /**
     * Create Lead technologies on the bases of lead_id
     * @param lead_id 
     * @param technologyIds 
     */
    public createLeadTechnologies(lead_id: string, technologyIds: any[]) {

        return Promise.each(technologyIds, (tech_id) => {
            //verify if their is any technology exist with same id 
            return this.findByAttribute({ lead_id: lead_id, tag_id: tech_id }).then(alreadyFoundTech => {
                if (!alreadyFoundTech) {
                    // create new lead technologies
                    let leadTechnologies: ILeadTechnologyModel = {
                        lead_id: lead_id,
                        tag_id: tech_id
                    }
                    return this.create(leadTechnologies);

                }
            })
        })
    }
    /**
     * Get all technologies specfic by given lead_id
     * @param lead_id 
     */
    public retrieveByLeadId(lead_id: string) {
        return this.findAllByAttributes({ lead_id: lead_id });
    }
    /**
     * 
     * @param lead_id 
     * @param technologies 
     */
    public deleteTechnologiesIfNotInAry(lead_id: string, technologies: any[]) {

        // Find all saved lead technology of lead
        return this.findAllByAttributes({ lead_id: lead_id }).then(leadTechnologyList => {
            let technologiesForRemove = [];
            // If we found any lead technology
            if (leadTechnologyList.length > 0) {

                _.forEach(leadTechnologyList, (leadTechnology) => {
                    if (_.indexOf(technologies, leadTechnology.tag_id) == -1) {
                        technologiesForRemove.push(leadTechnology.tag_id);
                    }
                });
            }
            //preparing condition for remove eg.
            /* Delete from table where lead_id = $lead_id And tag_id IS NOT NULL AND tag_id <> '' tag_id IN ($delete_tags) */
            let cond = {
                lead_id: lead_id,
                $and: [
                    { 'tag_id': { $exists: true } },
                    { 'tag_id': { $ne: null } },
                    { 'tag_id': { $in: technologiesForRemove } },
                ]
            }
            return this.deleteAllByAttributes(cond)
        })
    }

}

Object.seal(LeadTechnologyModel);
export =  LeadTechnologyModel;