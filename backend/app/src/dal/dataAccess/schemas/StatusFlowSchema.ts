import DataAccess = require("./../../dataAccess/DataAccess");
import IStatusFlowModel = require("./../../../model/interfaces/IStatusFlowModel");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

/**
 * 
 * @class StatusFlowSchema
 */
class StatusFlowSchema {

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
            business_group_id: {
                type: String,
                required: false
            },
            type: {
                type: String,
                enum: ['Lead', 'Default','Opportunity'],
                required: false,
                default: 'Default'
            },
            status: {
                type: Boolean,
                required: false,
                default: true
            },
            weight: {
                type: Number,
                required: false,
                default: 0
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
            console.log('---------save---------------');
            var timeStamp = Math.round(+new Date() / 1000);

            // change the updated_at field to current date
            this.updated_at = timeStamp;

            // if created_at doesn't exist, add to that field
            if (!this.created_at)
                this.created_at = timeStamp;

            //will be applied after some changes, if needed
            /**    
                var doc = this;
                schema.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function (error, counter) {
                    if (error)
                        return next(error);
                    doc.testvalue = counter.seq;
                    next();
                });
            **/

            next();
        });

        /**
        * setting virtual elements
        */
        schema.set('toJSON', {
            virtuals: true
        });
        schema.virtual('statusDisplay').get(function () {
            if (this.status) {
                return "Active"
            }
            return "In-Active"
        })

        schema.virtual('createdAgo').get(function () {
            return new Date(this.created_at * 1000)
        })
        schema.virtual('updatedAgo').get(function () {
            return new Date(this.updated_at * 1000)
        })

        return schema;
    }
}
var schema = mongooseConnection.model<IRoleModel>("StatusFlow", StatusFlowSchema.schema);
export = schema;