import DataAccess = require("./../../dataAccess/DataAccess");
import ICompanyModel = require("./../../../model/interfaces/ICompanyModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * Companies
 * @class CompanySchema
 */
class CompanySchema {

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true,
                unique: true
            },
            address: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            zip: {
                type: String,
                required: false
            },
            state: {
                type: String,
                required: false
            },
            country: {
                type: String,
                required: false
            },
            email: {
                type: String,
                required: false,
            },
            phone: {
                type: String,
                required: false
            },
            mobile: {
                type: String,
                required: false
            },
            fax: {
                type: String,
                required: false
            },
            website: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
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

        //TODO:low: There should be some inherited/central/common method for following pre method(s).
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
var schema = mongooseConnection.model<ICompanyModel>("Companies", CompanySchema.schema);
export = schema;