import DataAccess = require("./../../dataAccess/DataAccess");
import IContactModel = require("./../../../model/interfaces/IContactModel");

import CompanyModel = require("./../../../model/CompanyModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class ContactSchema
 */
class ContactSchema {

    static get schema() {
        var schema = mongoose.Schema({
            first_name: {
                type: String,
                required: true
            },
            last_name: {
                type: String,
                required: false
            },
            account: {
                type: String,
                required: false
            },
            company: {
                type: String,
                required: false,
                ref: 'Companies'
            },
            // company: { type: mongoose.Schema.ObjectId, ref: 'Companies', required: false,default: {} },
            email: {
                type: String,
                required: true,
                validate: {
                    isAsync: true,
                    validator: isEmailUnique,
                    message: 'Email already exists',
                    type: 'unique'
                }
            },
            secondary_eamil: {
                type: String,
                required: false
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
            skype_id: {
                type: String,
                required: false
            },
            website: {
                type: String,
                required: false
            },
            mailing_street: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            state: {
                type: String,
                required: false
            },
            zip: {
                type: String,
                required: false
            },
            country: {
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

        schema.set('toJSON', {
            virtuals: true
        });

        schema.virtual('companyRecord', {
            ref: 'Companies', // The model to use
            localField: 'company', // Find people where `localField`
            foreignField: '_id', // is equal to `foreignField`
            // If `justOne` is false, 'members' will be a single doc as opposed to
            // an array. `justOne` is false by default.
            justOne: true,

        });
        schema.virtual('name').get(function () {
            return this.first_name + ' ' + this.last_name;
        })

        // schema.virtual('companyRecord').get(function () {
        //    if(this.company){
        //        return new CompanyModel().findById(this.company).then(res=>{
        //            console.log(res.toJSON());
        //            return res.toJSON();
        //        })
        //    }
        //    return "";
        // })

        schema.path('email').validate(function (email) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            console.log(email);
            return emailRegex.test(email);
        }, 'The e-mail field is not valid.');

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
var schema = mongooseConnection.model<IContactModel>("Contacts", ContactSchema.schema);
export = schema;

/**
 * Validation 
 */

function isEmailUnique(value, done) {
    console.log('----------validation---------');

    let cond = { 'email': value }
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
};

