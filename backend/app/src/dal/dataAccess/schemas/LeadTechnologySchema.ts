import DataAccess = require("./../../dataAccess/DataAccess");
import ILeadTechnologyModel = require("./../../../model/interfaces/ILeadTechnologyModel");


var mongoose = DataAccess.mongooseInstance;

var mongooseConnection = DataAccess.mongooseConnection;

class LeadTechnologySchema {

    static get schema() {
        var schema = mongoose.Schema({
            lead_id: {
                type: String,
                required: true,
            },
            tag_id: {
                type: String,
                required: true
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

        return schema;
    }


}

var schema = mongooseConnection.model<ILeadTechnologyModel>("LeadTechnologies", LeadTechnologySchema.schema);


export = schema;
