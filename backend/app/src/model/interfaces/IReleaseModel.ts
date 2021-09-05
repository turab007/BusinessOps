import mongoose = require("mongoose");

interface IReleaseModel extends mongoose.Document {
    _id?: string,
    name: string,
    version: string,
    description?: string,
}

export = IReleaseModel;