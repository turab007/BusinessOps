import uniqueValidator = require('mongoose-unique-validator');

import DataAccess = require("./../../dataAccess/DataAccess");
import IUserModel = require("./../../../model/interfaces/IUserModel");

import UserModel = require("./../../../model/UserModel");

import SchemaValidation = require('./SchemaValidation');


var mongoose = DataAccess.mongooseInstance;


var ValidationError = mongoose.Error.ValidationError;
var ValidatorError = mongoose.Error.ValidatorError;


var mongooseConnection = DataAccess.mongooseConnection;
const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
class UserSchema {
    // let emailValidator = [validate({message: "Email Address should be between 5 and 64 characters"},'len', 5, 64), validate({message: "Email Address is not correct"},'isEmail')];

    static get schema() {
        var schema = mongoose.Schema({
            first_name: {
                type: String,
                required: true
            },
            last_name: {
                type: String,
                required: true
            },
            user_id: {
                type: String,
                required: true,
                //unique: [true, 'username/email must be unique.'],
                validate: {
                    isAsync: true,
                    validator: isEmailUnique,
                    message: 'Email already exists',
                    type: 'unique'
                }

                // validate: [SchemaValidation.unique(), 'Please provide a valid email address'],
                // 
                // validate: [AliValidator.unique(RoleSchema, 'user_id', 'User identification already exists'), 'Please provide a valid email address'],
            },
            auth_key: {
                type: String,
                required: false
            },
            password_hash: {
                type: String,
                required: false
            },
            password_reset_token: {
                type: String,
                required: false
            },
            activation_token: {
                type: String,
                required: false
            },
            status: {
                type: Boolean,
                required: false,
                default: false
            },
            is_admin: {//TODO:low: Remove it if needed.. Its only for demo
                type: Boolean,
                required: true,
                default: false
            },
            is_employee: {
                type:Boolean,
                required:true,
                default:false
            },
            emp_jobTtile:{
                type:String,
                required:false
            },
            work_spaces: [{ type: mongoose.Schema.ObjectId, ref: 'WorkSpaces' }], // (invited users)
            created_at: {
                type: Number,
                required: false
            },
            updated_at: {
                type: Number,
                required: false
            }
        });

        schema.path('user_id').validate(function (value) {
            return value != null;
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
        
        schema.pre('remove', function (next) {

            if (this.work_spaces) {
                let userModel = this;
                userModel.model('WorkSpaces').update(
                    { users: userModel._id },
                    { $pull: { users: userModel._id } },
                    { multi: true },
                    next);
            }
            else {
                next()
            }

        });

        /**
         * setting virtual elements
         */
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('fullname').get(function () {
            return this.first_name + ' ' + this.last_name;
        })
        schema.virtual('name').get(function () {
            return this.first_name + ' ' + this.last_name;
        })
        schema.virtual('initials').get(function () {
            if((this.first_name).split(" ").length>1){
                return Array.prototype.map.call((this.first_name).split(" "), function(x){ return x.substring(0,1).toUpperCase();}).join('');    
            }
            return Array.prototype.map.call((this.name).split(" "), function(x){ return x.substring(0,1).toUpperCase();}).join('');
           
        })
        // schema.plugin(uniqueValidator);

        return schema;
    }


}

var schema = mongooseConnection.model<IUserModel>("Useres", UserSchema.schema);

// ToDo:low take this to seperatee validation class
function isEmailUnique(value, done) {

    console.log('----------validation---------');

    let cond = { 'user_id': value }
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
//ToDo:Low take this function to seperate class level
function verifyOldPassword(value, done) {
    console.log('----------password validation---------');
    console.log(this.op)
    if (value && this.op && this.op == 'update' && this.getQuery()._id) {
        let cond = {
            '_id': this.getQuery()._id,
            'password_hash': value,
        }
        return schema.findOne(cond).then(result => {
            if (result) {
                return done();
            }
            return done(false);
        })
    }

}
export = schema;
