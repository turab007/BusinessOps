/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface IBusinessGroupModel extends mongoose.Document {
  name: string,
  description?: number,
}

export = IBusinessGroupModel;