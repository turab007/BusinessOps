import ta = require('time-ago');
import moment = require('moment');
import DataAccess = require("./../../dataAccess/DataAccess");
import IAccountModel = require("./../../../model/interfaces/IAccountModel");

import AccountModel = require("./../../../model/AccountModel");
import CompanyModel = require("./../../../model/CompanyModel");

var mongoose = DataAccess.mongooseInstance;

var mongooseConnection = DataAccess.mongooseConnection;



class AccountSchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            stage: {
                type: String,
                required: false
            },
            status: { // current situation
                type: String,
                required: false
            },
            business_group: { // current situation
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
            },
            address1: {
                type: String,
                required: false
            },
            address2: {
                type: String,
                required: false
            },
            address_city: {
                type: String,
                required: false
            },
            address_zip: {
                type: String,
                required: false
            },
            address_state: {
                type: String,
                required: false
            },
            address_country: {
                type: String,
                required: false
            },
            contact_name: {
                type: String,
                required: false
            },
            contact_id: {
                type: String,
                required: false,
                ref: 'Contacts'
            },
            contact_type:{
                type: String,
                required: false,
                default: 'new'
            },     
            designation: {
                type: String,
                required: false
            },
            company_name: {
                type: String,
                required: false
            },
            company_id: {
                type: String,
                required: false,
                ref: 'Companies'
            },
            company_type:{
                type: String,
                required: false,
                default: 'new'
            },
            time_zone: {
                type: String,
                required: false
            },
            contact_modes: {
                type: [{ value: String, name: String }],
                required: false,
                default: []
            },
            intersted_in: {
                type: Array,
                required: false,
                default: []
            },
            participants: {
                type: Array,
                required: false,
                default: []
            },
            is_active: {
                type: Boolean,
                default: false
            },
            created_at: {
                type: Number,
                required: false
            },
            updated_at: {
                type: Number,
                required: false
            }
        });

        schema.pre('save', function (next) {

            // get the current date unix_timestamp
            var timeStamp = Math.round(+new Date() / 1000);

            // change the updated_at field to current date
            this.updated_at = timeStamp;

            // if created_at doesn't exist, add to that field
            if (!this.created_at)
                this.created_at = timeStamp;

            next();
        });


        /**
        * setting virtual elements
        */
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('createdAgo').get(function () {
            let t = ta();
            // return t.ago(new Date() );
            return t.ago(new Date(this.created_at * 1000));
        })
        schema.virtual('createdDate').get(function () {
            return  moment(this.created_at * 1000).format("MMMM, d Y");
        })

        return schema;
    }


}

var schema = mongooseConnection.model<IAccountModel>("Accounts", AccountSchema.schema);


export = schema;
