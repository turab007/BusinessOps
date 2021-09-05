"use strict";
import _ = require('lodash-node');
import Promise = require('bluebird');
import DataAccess = require("./../src/dal/dataAccess/DataAccess");


import IWorkSpaceModel = require('../src/model/interfaces/IWorkSpaceModel');
import { WorkSpaceModel } from "./../src/model/barrel/";

import IUserModel = require('../src/model/interfaces/IUserModel');
import UserModel = require('../src/model/UserModel');

/**
 * Purpose of this example to to create Personal Workspace for each user
 */
class SeedWorkSpace {
    private _userModel: UserModel;
    private _workSpaceModel: WorkSpaceModel;


    protected mongoose = DataAccess.mongooseInstance;

    public static bootstrap(): SeedWorkSpace {
        return new SeedWorkSpace();
    }

    /**
     * Constructor.
     *
     * @class SeedWorkSpace
     * @constructor
    */
    constructor() {
        console.log("Work Space seed ... ");

        this._userModel = new UserModel();
        this._workSpaceModel = new WorkSpaceModel();

        //creating personal ws
        this.savePersonalWorkSpaceForAllUsers().then(result => {
            this.closeConnection();
        });
    }

    /**
     * Saving work sapce
    */
    private savePersonalWorkSpaceForAllUsers() {

        let p1 = this._userModel.findAll();

        return Promise.all([p1]).then(all => {
            let users = all[0];

            //adding new personal workspace  
            return Promise.each(users, (user) => {
                  console.log(user);
                if (_.size(user.work_spaces) == 0) {

                    let ws1Item = <IWorkSpaceModel>{ name: 'Personal workspace',space_type: 'Personal', users: [user.id],created_by:user.id,updated_by :user.id };
                    console.log(ws1Item);
                    //creating work Space model 
                    let wsP1 = this._workSpaceModel.create(ws1Item).then(res => {
                        //update user with workspace
                        let userItem = <IUserModel>{ work_spaces: [res.id]};
                        return this._userModel.update(user.id,userItem);
                    }).catch(error => {
                        return error;
                    })

                    return wsP1;
                }

                return user;
            })

        });
    }

    /**
     * close connections
    */
    private closeConnection() {
        console.log("Closing Mongoose connection");
        this.mongoose.connection.close();
    }
}
//running scripts
SeedWorkSpace.bootstrap();


