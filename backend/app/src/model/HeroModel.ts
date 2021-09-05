/// <reference path="../../_all.d.ts" />
import HeroRepository = require("./../dal/repository/HeroRepository");
import IHeroModel = require("./interfaces/IHeroModel");
import BaseModel = require("./base/BaseModel");

/**
 * Hero Model
 * 
 * @class HeroModel
 */
class HeroModel extends BaseModel<IHeroModel> {

    private _heroRepository: HeroRepository;

    private _heroModel: IHeroModel;

    constructor() {
        super(new HeroRepository());
        this._heroRepository = this._repo;
    }
    get name(): string {
        return this._heroModel.name;
    }

    get power(): string {
        return this._heroModel.power;
    }

    get amountPeopleSaved(): number {
        return this._heroModel.amountPeopleSaved;
    }

    getMyCountRegardingUser() {
        return this._heroRepository.getMyCountRegardingUser();
    }

    listAllHeroes() {
        return this._heroRepository.listAllHeroes();
    }
}

Object.seal(HeroModel);
export { HeroModel };