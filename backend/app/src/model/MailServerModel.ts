/// <reference path="../../_all.d.ts" />
import MailServerRepository = require("./../dal/repository/MailServerRepository");
import IMailServerModel = require("./interfaces/IMailServerModel");
import BaseModel = require("./base/BaseModel");

/**
 * MailServer Model
 * 
 * @class MailServerModel
 */
class MailServerModel extends BaseModel<IMailServerModel> {

    private _mailServerRepository: MailServerRepository;

    constructor() {
        super(new MailServerRepository());
        this._mailServerRepository = this._repo;
    }

    create(item) {
        return super.create(this.checkGmailPresent(item));
    }

    update(_id: string, item) {
        return super.update(_id, this.checkGmailPresent(item));
    }
    /**
     * if Gmail involvement found then no need host and port because nodemailer works without host and port if Gmail found
     * 
     * @param item 
     */
    private checkGmailPresent(item) {
        if (item.is_gmail) {
            item['host'] = null;
            item['port'] = null;
        }
        return item;
    }

}

Object.seal(MailServerModel);
export { MailServerModel };