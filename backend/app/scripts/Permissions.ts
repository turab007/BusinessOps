/// <reference path="../_all.d.ts" />
"use strict";
import _ = require('lodash-node');
import Promise = require('bluebird');

// import Constants = require('../src/config/constants/Constants');
import DataAccess = require("./../src/dal/dataAccess/DataAccess");

import IModuleModel = require('../src/model/interfaces/IModuleModel');
import { ModuleModel,PermissionModel,PermissionChildrenModel } from "./../src/model/barrel/";
import IPermissionModel = require('../src/model/interfaces/IPermissionModel');
import IPermissionChildrenModel = require('../src/model/interfaces/IPermissionChildrenModel');


import PermissionData = require("./PremissionData");





/**
 * PermissionScript class, the main entry point/middleware (express).
 *
 * @class PermissionScript
 */
class PermissionScript {

    private _moduleModel: ModuleModel;
    private _permissionModel: PermissionModel;
    private _permissionChildModel: PermissionChildrenModel;

    protected mongoose = DataAccess.mongooseInstance;

    /**
     * Bootstrap the application.
     *
     * @class PermissionScript
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): PermissionScript {
        return new PermissionScript();
    }

    /**
     * Constructor.
     *
     * @class PermissionScript
     * @constructor
     */
    constructor() {
        console.log("Checking RBAC Permissions... ");

        this._moduleModel = new ModuleModel();
        this._permissionModel = new PermissionModel();
        this._permissionChildModel = new PermissionChildrenModel();

        this.saveModules().then(result => {

            this.closeConnection();

        });

    }

    private saveModules() {

        return Promise.each(PermissionData, (module) => {

            let moduleRec: IModuleModel = {
                name: module.name,
                status: module.status,
                description: module.description,
                weight: module.weight
            }

            // Check module exists or not
            return this._moduleModel.findByAttribute({ name: module.name }).then(result => {
                // if existed 
                if (result) {
                    return this._moduleModel.update(result._id, moduleRec).then(updateResult => {

                        // console.log("Module Updated: " + moduleRec.name);
                        return this.saveModulePermissions(result._id, module.modulePermissions);
                    })
                }
                else {

                    return this._moduleModel.create(moduleRec).then(createdResult => {

                        console.log("Module Created: " + moduleRec.name);
                        return this.saveModulePermissions(createdResult._id, module.modulePermissions);

                    })
                }
            })

        })
    }

    private saveModulePermissions(module_id, modulePermissions) {

        return Promise.each(modulePermissions, (obj) => {

            return this.savePermissions(module_id, obj.permissionItems).then(result => {

                return this.savePermissionChildren(obj.permissionChildren);

            })

        })
    }

    private savePermissions(module_id, permissionItems) {

        return Promise.each(permissionItems, (permissionItem) => {

            let permissionRecord: IPermissionModel = {
                module_id: module_id,
                title: permissionItem.title,
                controller: permissionItem.controller,
                action: permissionItem.action,
                description: permissionItem.description,
                weight: permissionItem.weight
            };

            // Find permission already exist or not
            return this._permissionModel.findByAttribute({ controller: permissionItem.controller, action: permissionItem.action }).then(result => {
                if (result) {

                    // console.log("---- Permission Updated: " + permissionRecord.title);
                    return this._permissionModel.update(result._id, permissionRecord)

                } else {

                    console.log("---- Permission Created: " + permissionRecord.title);
                    return this._permissionModel.create(permissionRecord);
                }
            })

        })
    }

    private savePermissionChildren(permissionChildren) {

        return Promise.each(permissionChildren, (permissionChild) => {

            // Parent Permission Attributes for getting controller/action
            let PPAttr = permissionChild.parent.split('.');

            return this._permissionModel.findByAttribute({ controller: PPAttr[0], action: PPAttr[1] }).then(parentPermission => {

                if (parentPermission) {

                    let CPAttr = permissionChild.child.split('.');

                    return this._permissionModel.findByAttribute({ controller: CPAttr[0], action: CPAttr[1] }).then(childPermission => {

                        if (childPermission) {

                            // Find permission child in permission_children table
                            return this._permissionChildModel.findByAttribute({ parent_id: parentPermission._id, child_id: childPermission._id }).then(result => {
                                let PCRec: IPermissionChildrenModel = {
                                    parent_id: parentPermission._id,
                                    child_id: childPermission._id,
                                    parent_permission: permissionChild.parent,
                                    child_permission: permissionChild.child
                                }
                                if (result) {

                                    // console.log("-------- Child Updated: " + parentPermission.title + " - " + childPermission.title);
                                    return this._permissionChildModel.update(result._id, PCRec);

                                } else {
                                    console.log("-------- Child Created: " + parentPermission.title + " - " + childPermission.title);
                                    return this._permissionChildModel.create(PCRec);
                                }
                            })
                        }

                    })
                }
            })

        })

    }


    private closeConnection() {
        console.log("Closing Mongoose connection");
        this.mongoose.connection.close();
    }

    /**
     * Handle error.
     * 
     * @class PermissionScript
     * @method errorHandler
     * @return void
     */
    private errorHandler() {


    }
}

var permissionScript = PermissionScript.bootstrap();
module.exports = permissionScript;