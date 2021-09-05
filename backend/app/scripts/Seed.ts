"use strict";
import _ = require('lodash-node');
import Promise = require('bluebird');
import bcrypt = require('bcryptjs');
import DataAccess = require("./../src/dal/dataAccess/DataAccess");

import IUserModel = require('../src/model/interfaces/IUserModel');
import UserModel = require('../src/model/UserModel');

import IMailServerModel = require('../src/model/interfaces/IMailServerModel');
import { MailServerModel } from "./../src/model/barrel/";

//creating user
let mongoose = DataAccess.mongooseInstance;
let User: IUserModel = <IUserModel>{ first_name: 'Tehseen', last_name: 'Ahmad', user_id: 'tehseen@nxvt.com', status: true, is_admin: true, password_hash: bcrypt.hashSync("admin123", 10) };

let p1 = new UserModel().create(User).then(res => {
    return res;
}).catch(error=>{
    return error;
})

 
let p2 = new MailServerModel().getTotalCount().then(res => {
    if (res == 0) {
        // will run once to save
        let MailServer: IMailServerModel = <IMailServerModel>{ is_gmail: true, password: "abc123AB@", user_name: "testservice2015@gmail.com" };
        return new MailServerModel().create(MailServer).then(resSave => {
            return resSave;
        })
    }
    else {
        return res;
    }
})



Promise.all([p1, p2]).then(allP => {
    mongoose.connection.close();
    return allP;
});