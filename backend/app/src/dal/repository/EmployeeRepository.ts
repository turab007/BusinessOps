import { IEmployeeModel } from "./../../model/interfaces/barrel";
import EmployeeSchema = require("./../dataAccess/schemas/EmployeeSchema");
import RepositoryBase = require("./base/RepositoryBase");

/**
 * EmployeeRepository
 * 
 * @class EmployeeRepository
 */
class EmployeeRepository extends RepositoryBase<IEmployeeModel> {

    constructor() {
        super(EmployeeSchema);
    }
}
export = EmployeeRepository;