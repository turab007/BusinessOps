/// <reference path="../../_all.d.ts" />

import BaseModel = require("./base/BaseModel");
import PermissionRepository = require("./../dal/repository/PermissionRepository");
import IPermissionModel = require("./interfaces/IPermissionModel");
import PermissionChildrenRepository = require("./../dal/repository/PermissionChildrenRepository");
import { PermissionChildrenModel } from './barrel/';

import Promise = require('bluebird');

import _ = require('lodash-node');

/**
 * Permission Model
 * TODO:low:15May17: following class and its methods are not properly documented.
 * @class PermissionModel
 */
class PermissionModel extends BaseModel<IPermissionModel> {

    private _permissionChildModel = new PermissionChildrenModel();
    public permissionIds: any[] = [];
    public childPerRepo = new PermissionChildrenRepository();

    constructor() {
        super(new PermissionRepository());
    }

    public testArray: any[];

    findByModule(module_id) {

        return this._repo.find({ module_id: module_id, action: '*' }).then((result) => {

            return Promise.each(result, (permission) => {

                console.log("======================================================");
                this.testArray = [];
                this.weight = 0
                return this.recursiveMethod3(permission._id, 0).then(result22 => {

                    let obj = {
                        _id: permission._id,
                        title: permission.title,
                        permissions: this.testArray
                    }

                    this.permissionIds.push(obj);

                    // console.log(result22);
                    // let myObj2 = {}
                    // myObj2['_id'] = permission._id;
                    // myObj2['title'] = permission.title;
                    // myObj2['permission'] = permission.controller + "." + permission.action;


                    // myObj2['permissions'] = this.testArray.reverse();

                    // this.permissionIds.push(myObj2);
                });
                // this.testArray = [];

                // console.log('---------------------------------------------------')
                // console.log(permission.controller + "." + permission.action);

                // return this.recursiveMethod(permission);
                // return this.recursiveMethod2(permission._id).then(recursiveResult => {

                //     let myObj = {};

                //     myObj['_id'] = permission._id;
                //     myObj['title'] = permission.title;
                //     myObj['permission'] = permission.controller + "." + permission.action;

                //     myObj['children'] = this.testArray;

                //     // console.log(myObj);

                //     // return myObj;

                //     this.permissionIds.push(myObj);

                // });

                // return this.recursiveMethod(permission).then(result2 => {


                //     let myObj = {};

                //     myObj['_id'] = permission._id;
                //     myObj['title'] = permission.title;
                //     myObj['permission'] = permission.controller + "." + permission.action;


                //     // myObj[permission._id] = permission.controller + "." + permission.action;

                //     // console.log(this.testArray);
                //     myObj['children'] = this.testArray;

                //     this.permissionIds.push(myObj);

                // });

            }).then(resss => {

                // console.log(this.permissionIds);
                return this.permissionIds;
            })
            // .then(finalResult => {

            //     console.log(finalResult);
            //     return finalResult
            //     // console.log(result);
            //     // console.log(this.permissionIds);
            //     // return this.permissionIds;
            // });
        });

    }
    public weight = 0;
    recursiveMethod3(permission_id, level) {

        let myObj2 = {}

        return this.findById(permission_id).then(permission => {

            myObj2['_id'] = permission._id;
            myObj2['title'] = permission.title;
            myObj2['permission'] = permission.controller + "." + permission.action;
            myObj2['level'] = level;
            myObj2['weight'] = this.weight;

            this.testArray.push(myObj2);

            console.log(this.weight + ": " + level + ": " + permission.controller + "." + permission.action);

            // Get all children of permission_id
            return this._permissionChildModel.findAllByAttributes({ parent_id: permission_id }).then(children => {

                if (children.length > 0) {
                    level++;

                    let cha = [];
                    // Read all children
                    return Promise.each(children, (child) => {
                        this.weight++;
                        // cha.push(myObj2)
                        return this.recursiveMethod3(child.child_id, level).then(recursiveResult => {
                            // cha.push(recursiveResult);
                            // myObj2['children'] = cha;
                            // this.testArray.push(myObj2);
                            // return myObj2;
                        });

                    })

                } else {
                    // this.testArray.push(myObj2);
                    // return myObj2;
                }

            })
        }).then(result3 => {

            // console.log(myObj2);
            // console.log('----------------');
            return result3;
        })

    }

    recursiveMethod2(permission_id) {

        // Get all children of permission_id
        return this._permissionChildModel.findAllByAttributes({ parent_id: permission_id }).then(children => {

            // Read all children
            return Promise.each(children, (child) => {

                return this.findById(child.child_id).then(childPermission => {

                    console.log(childPermission.controller + "." + childPermission.action);

                    let myObj2 = {};
                    myObj2['_id'] = childPermission._id;
                    myObj2['title'] = childPermission.title;
                    myObj2['permission'] = childPermission.controller + "." + childPermission.action;

                    this.testArray.push(myObj2);

                    return this.recursiveMethod2(child.child_id);
                    // return this.recursiveMethod2(child.child_id).then(result => {

                    //     console.log(result);

                    //     let myObj2 = {};
                    //     myObj2['_id'] = childPermission._id;
                    //     myObj2['title'] = childPermission.title;
                    //     myObj2['permission'] = childPermission.controller + "." + childPermission.action;
                    //     myObj2['childPermissions'] = result;

                    //     return myObj2;

                    // });

                })

            })

        })
    }

    recursiveMethod(parentPermission) {

        return this.childPerRepo.find({ parent_id: parentPermission._id }).then((children) => {

            // let perAry = [];

            return Promise.each(children, (child) => {

                return this._repo.findById(child.child_id).then((permission) => {

                    // myObj[permission._id] = permission.controller + "." + permission.action;

                    console.log(permission.controller + "." + permission.action);

                    return this.recursiveMethod(permission).then(asdf => {
                        let myObj2 = {};
                        myObj2['_id'] = permission._id;
                        myObj2['title'] = permission.title;
                        myObj2['permission'] = permission.controller + "." + permission.action;

                        console.log(myObj2['permission']);
                        // perAry.push(myObj2);
                        this.testArray.push(myObj2);

                        return this.testArray;
                    });

                });

            })
            // .then(result => {
            //     return perAry;
            // });
        })
    }


}
Object.seal(PermissionModel);
export { PermissionModel };