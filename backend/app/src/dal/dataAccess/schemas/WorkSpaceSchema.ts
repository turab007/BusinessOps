import uniqueValidator = require('mongoose-unique-validator');

import DataAccess = require("./../../dataAccess/DataAccess");
import IWorkSpaceModel = require("./../../../model/interfaces/IWorkSpaceModel");

import { random_bg_color } from './../../../helpers/User.Helper';

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class WorkSpaceSchema {
    // let emailValidator = [validate({message: "Email Address should be between 5 and 64 characters"},'len', 5, 64), validate({message: "Email Address is not correct"},'isEmail')];

    static get schema() {
        var schema = mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: false
            },
            space_type: {
                type: String,
                required: true,
                enum: ['Personal', 'Custom', 'Fixed'],
                default: 'Custom'
            },
            users: [{ type: mongoose.Schema.ObjectId, ref: 'Useres' }], // (invited users)
            modules: [{ type: mongoose.Schema.ObjectId, ref: 'Modules' }], // (modules or applets)
            roles: [{ type: mongoose.Schema.ObjectId, ref: 'Roles' }], // (roles)
            link_lists: [{ type: mongoose.Schema.ObjectId, ref: 'Lists' }], // (lists) (only shared or linked)
            is_active: {
                type: Boolean,
                required: false,
                default: true,
            },
            read_only: {
                type: Boolean,
                required: false,
                default: false,
            },
            created_at: {
                type: Number,
            },
            updated_at: {
                type: Number,
            },
            created_by: {
                type: String,
                ref: 'Useres'
            },
            updated_by: {
                type: String,
            },
            user_role:  //TODO MERGE USER AND USER_ROLE
            [
                {
                    _id: {
                        type: mongoose.Schema.ObjectId, ref: 'Useres'
                    },
                    role:
                    {
                         type: mongoose.Schema.ObjectId, ref: 'Roles'
                    }
                }
            ]

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
            let workSpaceModel = this;
            if (this.users) {

                workSpaceModel.model('Useres').update(
                    { work_spaces: workSpaceModel._id },
                    { $pull: { work_spaces: workSpaceModel._id } },
                    { multi: true },
                    next);
            }
            if (this.modules) {
                workSpaceModel.model('Modules').update(
                    { work_spaces: workSpaceModel._id },
                    { $pull: { work_spaces: workSpaceModel._id } },
                    { multi: true },
                    next);
            }
            if (this.roles) {
                workSpaceModel.model('Roles').update(
                    { work_spaces: workSpaceModel._id },
                    { $pull: { work_spaces: workSpaceModel._id } },
                    { multi: true },
                    next);
            }
            else {
                next()
            }

        });

        schema.set('toJSON', {
            virtuals: true
        });

        schema.virtual('lists_count').get(function () {
            return 0;
        })
        schema.virtual('groups_count').get(function () {
            return 0;
        })
        schema.virtual('users_count').get(function () {
            return 0;
        })
        schema.virtual('bg_color').get(function () {
            return random_bg_color();
        })


        return schema;
    }
}

var schema = mongooseConnection.model<IWorkSpaceModel>("WorkSpaces", WorkSpaceSchema.schema);

export = schema;
