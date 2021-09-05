"use strict";
import _ = require('lodash-node');
import Promise = require('bluebird');
import bcrypt = require('bcryptjs');
import DataAccess = require("./../src/dal/dataAccess/DataAccess");


import IWorkSpaceModel = require('../src/model/interfaces/IWorkSpaceModel');
import { WorkSpaceModel,ModuleModel,RoleModel } from "./../src/model/barrel/";

import IUserModel = require('../src/model/interfaces/IUserModel');
import IRoleModel = require('../src/model/interfaces/IRoleModel');
import IModuleModel = require('../src/model/interfaces/IModuleModel');

import UserModel = require('../src/model/UserModel');


class ManyToManySample {
    private _roleModel: RoleModel;
    private _userModel: UserModel;
    private _moduleModel: ModuleModel;
    private _workSpaceModel: WorkSpaceModel;

    protected mongoose = DataAccess.mongooseInstance;

    public static bootstrap(): ManyToManySample {
        return new ManyToManySample();
    }

    /**
     * Constructor.
     *
     * @class ManyToManySample
     * @constructor
    */
    constructor() {
        console.log("Many to Many examples... ");

        this._roleModel = new RoleModel();
        this._userModel = new UserModel();
        this._moduleModel = new ModuleModel();
        this._workSpaceModel = new WorkSpaceModel();

        //creating ws
        // this.saveWorkSpace().then(result => {
        //     this.closeConnection();
        // });

        //***************Creating dummpy relations with workspace ========================= */
        // this.creatingDummyRelationalData().then(result => {

        //     this.closeConnection();

        // });

        //*************** Removing Workspace relations ========================= */
        // this.removeLastItemsofWorkSpaceRelations().then(result => {

        //     this.closeConnection();

        // });

        //=============For testing deletion=============//
        // this.removeWorkSpace().then(result => {

        //     this.closeConnection();

        // });

        //******************update workspace test****************/
        this.updateWorkSpace().then(result=>{
            this.closeConnection();
        })

    }

    /**
     * Saving work sapce
    */
    private saveWorkSpace() {
        let p1 = this._roleModel.findLatestRecord();
        let p2 = this._userModel.findLatestRecord();
        let p3 = this._moduleModel.findLatestRecord();

        return Promise.all([p1, p2, p3]).then(all => {
            let role = all[0];
            let user = all[1];
            let module = all[2];


            let ws1Item = <IWorkSpaceModel>{ name: 'My WorkSpace 2', users: [user], modules: [module], roles: [role] };
            console.log(ws1Item);
            //creating work Space model 
            let wsP1 = this._workSpaceModel.create(ws1Item).then(res => {
                let p1 = this._roleModel.update(role._id,<IRoleModel>{work_spaces: [res._id]});
                let p2 = this._userModel.update(user._id,<IUserModel>{work_spaces: [res._id]});
                let p3 = this._moduleModel.update(module._id,<IModuleModel>{work_spaces: [res._id]});

                return Promise.all([p1,p2,p3,res]);
                // return res;

            }).catch(error => {

                return error;
            })

            return wsP1;

        });
    }
    /**
     * Testing of update workspace
     */
    private updateWorkSpace(){
        return this._workSpaceModel.findLatestRecord().then(record=>{
            let ws1Item = <IWorkSpaceModel>{ name: 'My WorkSpace 22', users: ["5911db2b9235272052fdd2e1"], modules: record.modules, roles: record.roles };
            return this._workSpaceModel.updateByReferences(record._id,ws1Item);
        })
    }
    /**
     * Lets create dummy user, role, module for testing of workspace
     */
    private creatingDummyRelationalData() {
        let User: IUserModel = <IUserModel>{ first_name: 'WorkSpace', last_name: 'Delete', user_id: 'ws1@site.com', status: true, is_admin: true, password_hash: bcrypt.hashSync("admin123", 10) };
        let Role: IRoleModel = <IRoleModel>{ name: 'WorkSpace Delete' };

        let Module: IModuleModel = <IModuleModel>{ 
            name: 'WorkSpace Delete', 
            status: true, 
            description: 'WorkSpace Delete', 
            weight: 3 
        };

        let p1 = this._userModel.create(User);
        let p2 = this._roleModel.create(Role);
        let p3 = this._moduleModel.create(Module).then(res=>{
            return res;
        }).catch(err=>{
            console.log(err);
            return err;
        })
        

        return Promise.all([p1, p2, p3]);
    }
    /**
     * Remove Last items of Role,Module,User 
     * For testing for worksppce pull
     */
    private removeLastItemsofWorkSpaceRelations(){
        let p1 = this._roleModel.findLatestRecord();
        let p2 = this._userModel.findLatestRecord();
        let p3 = this._moduleModel.findLatestRecord();

        let p11 = p1.then(record=>{
            return this._roleModel.delete(record._id);
        })
        let p12 = p2.then(record=>{
            return this._userModel.delete(record._id);
        })

        let p13 = p3.then(record=>{
            return this._moduleModel.delete(record._id);
        })

        return Promise.all([p11, p12, p13]);
    }
    /**
     * For testing realtionships are removed are not
     */
    private removeWorkSpace(){
        let _id = "5968973b32715a4d8811d299"; // changeable
        return this._workSpaceModel.delete(_id);
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
ManyToManySample.bootstrap();


