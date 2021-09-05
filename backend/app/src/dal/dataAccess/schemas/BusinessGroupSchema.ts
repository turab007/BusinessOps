

import DataAccess = require("./../../dataAccess/DataAccess");
import IBusinessGroupModel = require("./../../../model/interfaces/IBusinessGroupModel");

import BusinessGroupModel = require("./../../../model/BusinessGroupModel");

var mongoose = DataAccess.mongooseInstance;

var mongooseConnection = DataAccess.mongooseConnection;

class BusinessGroupSchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true,
                validate: {
                    isAsync: true,
                    validator: isNameUnique,
                    message: 'Name already exists',
                    type: 'unique'
                }
            },
            description: {
                type: String,
                required: false
            },
            status: {
                type: Boolean,
                required: false,
                default: false
            },
            lead_status_flow: [
                {
                    title: {
                        type: String,
                        require: true
                    },
                    status:{
                        type: Boolean,
                        require: true,
                        default: true
                    },
                    weight: {
                        type: Number,
                        require: false,
                        default: 0
                    }
                }
            ],
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

        return schema;
    }


}

var schema = mongooseConnection.model<IUserModel>("BusinessGroups", BusinessGroupSchema.schema);
// ToDo:low take this to seperatee validation class
function isNameUnique(value, done) {

    console.log('----------validation---------');

    let cond = { 'name': value }
    //update mode
    if (this.op && this.op == 'update') {
        cond['_id'] = { '$ne': this.getQuery()._id }
    }
    if (value) {
        return schema.count(cond).then(result => {
            if (result > 0) {
                return done(false);
            }
            return done();
        })
    }
}

export = schema;
