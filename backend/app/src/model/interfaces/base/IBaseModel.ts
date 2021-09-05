import IRead = require("./../common/IRead");
import IWrite = require("./../common/IWrite");
interface IBaseModel<T> extends IRead<T>, IWrite<T> 
{
}
export = IBaseModel;