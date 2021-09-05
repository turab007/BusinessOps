/// <reference path="../_all.d.ts" />
"use strict";
// import Constants = require('../src/config/constants/Constants');
import IModuleModel = require('../src/model/interfaces/IModuleModel');
import { ModuleModel,PermissionModel,PermissionChildrenModel } from "./../src/model/barrel/";
import IPermissionModel = require('../src/model/interfaces/IPermissionModel');
import IPermissionChildrenModel = require('../src/model/interfaces/IPermissionChildrenModel');
import DataAccess = require("./../src/dal/dataAccess/DataAccess");
import PermissionData = require("./PremissionData1");

import _ = require('lodash-node');



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
        console.log('Permission Script ..................................................................');

        this._moduleModel = new ModuleModel();
        this._permissionModel = new PermissionModel();

        var modules = PermissionData.PermissionData;

        this.insertModule(modules.Security)
        // this.insertModule(modules.Leads)
    }

    public insertModule(module) {

        let IMM: IModuleModel;
        let IPM: IPermissionModel;

        IMM = {
            name: module.name,
            description: module.description,
            status: module.status,
            weight: module.weight
        }

        // Save module
        this._moduleModel.findByAttribute({ name: IMM.name }).then((result) => {
            if (result) {
                return this.function2(module, result);
            }
            else {
                this._moduleModel.create(IMM).then((moduleResult) => {

                    return this.function2(module, moduleResult);

                }).catch(e => console.log(e));
            }
        });

    }

    public function2(module, moduleResult) {

        _.forIn(module.Permissions, function (value, k2) {

            // console.log("Moduel: " + moduleResult.name);

            let IPM: IPermissionModel;

            IPM = {
                module_id: moduleResult._id,
                title: k2 + '.*',
                controller: k2,
                action: '*',
                weight: 0,
            }

            // console.log("Permission: " + IPM.title);

            new PermissionModel().findByAttribute({ module_id: IPM.module_id, controller: IPM.controller, action: IPM.action }).then((parentPermission) => {
                if (parentPermission) {
                    return PermissionScript.insertPermissions(module.Permissions[k2], parentPermission, moduleResult);
                }
                else {
                    new PermissionModel().create(IPM).then((parentPermission) => {

                        console.log("Created Permission: " + parentPermission.title);

                        return PermissionScript.insertPermissions(module.Permissions[k2], parentPermission, moduleResult);

                    }).catch(e => console.log(e))
                }
            });

        });
    }

    static insertPermissions(permissions, parentPermission, moduleResult) {

        _.forIn(permissions, function (value, k3) {

            var permission = value;//permissions[k3];
            var children = permission.children;

            let IPM2: IPermissionModel;

            IPM2 = {
                module_id: moduleResult._id,
                title: k3,
                controller: permission.controller,
                action: permission.action,
                weight: permission.weight
            }

            // console.log("Permission: " + IPM2.title);

            new PermissionModel().findByAttribute({ module_id: IPM2.module_id, controller: IPM2.controller, action: IPM2.action }).then((result) => {

                if (result) {

                    if (permission.coreChild && permission.coreChild == true) {
                        PermissionScript.insertCoreChild(parentPermission, result);
                    }

                    if (children != undefined && children != null) {
                        PermissionScript.insertPermissionChildren(children, result);
                    }

                }
                else {
                    new PermissionModel().create(IPM2).then((result) => {

                        console.log("Created Permission: " + result.title);

                        if (permission.coreChild && permission.coreChild == true) {
                            PermissionScript.insertCoreChild(parentPermission, result);
                        }

                        if (children != undefined && children != null) {
                            PermissionScript.insertPermissionChildren(children, result);
                        }

                    }).catch(e => console.log(e))

                }

            })
        })
    }

    static insertCoreChild(parentPermission, childPermission) {
        new PermissionChildrenModel().findByAttribute({ parent_id: parentPermission._id, child_id: childPermission._id }).then((childResult) => {

            if (!childResult) {

                let IPC: IPermissionChildrenModel;
                // IPC = {
                //     parent_id: parentPermission._id,
                //     child_id: childPermission._id
                // }
                // // console.log("Core Child: " + childPermission.title);

                // new PermissionChildrenModel().create(IPC).then((result) => {
                //     console.log("Created Child Permission: " + childPermission.title + " (" + result._id + ")");
                // });
            }
            else {
                return true;
            }
        });

    }

    static insertPermissionChildren(children, parentPermission) {


        _.forIn(children, function (value, index) {

            var child = value;

            // console.log("child: " + child);

            let childPermission = child.split(".");
            let childPermissionController = childPermission[0];
            let childPermissionAction = childPermission[1];

            // Find child permission record permission table to get its id
            new PermissionModel().findByAttribute({ controller: childPermissionController, action: childPermissionAction }).then((result) => {
                if (result) {
                    // Now find if record does not exist in permissionchildren table
                    // console.log(result)

                    new PermissionChildrenModel().findByAttribute({ parent_id: parentPermission._id, child_id: result._id }).then((childResult) => {

                        if (!childResult) {

                            let IPC: IPermissionChildrenModel;
                            // IPC = {
                            //     parent_id: parentPermission._id,
                            //     child_id: result._id
                            // }
                            // console.log("Creating Child: " + child);

                            new PermissionChildrenModel().create(IPC).then((result) => {
                                console.log("Created Child Permission: " + child + " (" + result._id + ")");
                            });
                        }
                        else {
                            return true;
                        }
                    });

                }
                else {
                    console.log('Child permission (' + child + ') not found..');
                }
            });

        })
    }

    private closeConnection() {
        console.log('Closing Mongoose connection for script ..................................................................');
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