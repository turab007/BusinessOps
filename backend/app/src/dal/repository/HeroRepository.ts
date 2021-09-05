import HeroModel = require("./../../model/HeroModel");
import IHeroModel = require("./../../model/interfaces/IHeroModel");
import HeroSchema = require("./../dataAccess/schemas/HeroSchema");
import RepositoryBase = require("./base/RepositoryBase");

import mongoose = require("mongoose");

/**
 * 
 * 
 * @class HeroRepository
 */
class HeroRepository extends RepositoryBase<IHeroModel> {

    constructor() {
        super(HeroSchema);
    }

    getMyCountRegardingUser() {
        return this._model.find({})
    }

    listAllHeroes() {
        return this._model.find({})
    }
}

Object.seal(HeroRepository);
export = HeroRepository;