import DataAccess = require("./../../dataAccess/DataAccess");
import IMailServerModel = require("./../../../model/interfaces/IMailServerModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class MailServerSchema
 */
class MailServerSchema {

    static get schema() {
        var schema = mongoose.Schema({
            host: {
                type: String,
                required: false,
                validate: [{
                    aysnc: false,
                    validator: isValidHost,
                    message: 'Invalid Host',
                    type: 'pattern'
                },{
                    isAsync: true,
                    validator: isHostUnique,
                    message: 'Host already exists',
                    type: 'unique'
                }]
            },
            port: {
                type: String,
                required: false
            },
            user_name: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: false
            },

            is_gmail: {
                type: Boolean,
                required: false,
                default: true
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

        /**
         * setting virtual elements
         */
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('title').get(function () {
            if(this.is_gmail){
                return "G-Mail"
            }
            return this.host;
        })

        return schema;
    }
}
var schema = mongooseConnection.model<IMailServerModel>("MailServer", MailServerSchema.schema);

// ToDo:low take this to seperatee validation class
function isValidHost(value) {


    if (value) {
        let validHostnameRegex = "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$";
        "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$";
        var patt = new RegExp(validHostnameRegex);
        console.log("----------");
        console.log(patt.test(value));
        return patt.test(value)
    }

    return true;
}
// ToDo:low take this to seperatee validation class
function isHostUnique(value, done) {

    console.log('----------validation---------');

    let cond = { 'host': value }
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