import Promise = require('bluebird');

import DataAccess = require("./../src/dal/dataAccess/DataAccess");
import LeadSchema = require('../src/dal/dataAccess/schemas/LeadSchema');
import StatusFlowSchema = require('../src/dal/dataAccess/schemas/StatusFlowSchema');
import ReleaseSchema = require('../src/dal/dataAccess/schemas/ReleaseSchema');

let mongoose = DataAccess.mongooseInstance;

let p1 = LeadSchema.collection.getIndexes(function (err, results) {
    // Handle errors
    console.log(results);
    return results;
});

let p2 = StatusFlowSchema.collection.getIndexes(function (err, results) {
    // Handle errors
    console.log(results);
    return results;
});

let p3 = ReleaseSchema.collection.getIndexes(function (err, results) {
    // Handle errors
    console.log(results);
    return results;
});

Promise.all([p1,p2,p3]).then(pRes=>{
    LeadSchema.collection.dropIndex("name_1");
    StatusFlowSchema.collection.dropIndex("name_1");
    ReleaseSchema.collection.dropIndex("name_1");
    mongoose.connection.close();
})
