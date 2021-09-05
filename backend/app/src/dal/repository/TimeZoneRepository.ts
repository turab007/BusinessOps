import ITimeZoneModel = require("./../../model/interfaces/ITimeZoneModel");
import TimeZoneSchema = require("./../dataAccess/schemas/TimeZoneSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * TimeZoneRepository 
 * 
 * 
 * @class TimeZoneRepository
 */
class TimeZoneRepository extends RepositoryBase<ITimeZoneModel> {

    constructor() {
        super(TimeZoneSchema);
    }
}
export = TimeZoneRepository;