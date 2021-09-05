import DataAccess = require("./../../dataAccess/DataAccess");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;



class NoteSchema {
    static get  schema() {

        var schema = mongoose.Schema({
            subject: {
                type: String,
                required: false,
            },
            detail: {
                type: String,
                required: false,
            },
            is_important: {
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
        })
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

var schema = mongooseConnection.model("Notes", NoteSchema.schema);
export  = schema