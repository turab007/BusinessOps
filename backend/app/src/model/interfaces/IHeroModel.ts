/// <reference path="../../../_all.d.ts" />
import mongoose = require("mongoose");

interface IHeroModel extends mongoose.Document {
  power?: string;
  amountPeopleSaved: number;
  name: string;
}

export = IHeroModel;