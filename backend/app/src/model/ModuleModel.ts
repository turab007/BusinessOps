/// <reference path="../../_all.d.ts" />
import Promise = require("bluebird");
import _ = require("lodash-node");

import ModuleRepository = require("./../dal/repository/ModuleRepository");
import IModuleModel = require("./interfaces/IModuleModel");
import BaseModel = require("./base/BaseModel");
import { RoleModel } from './barrel/';
import { PermissionModel } from './barrel/';
import PermissionChildrenModel = require('./PermissionChildrenModel')

/**
 * Module Model
 * 
 * @class ModuleModel
 */
class ModuleModel extends BaseModel<IModuleModel> {

    constructor() {
        super(new ModuleRepository());
    }

    public modules: any[] = [];

    //TODO:low: Use enum instead of hadcoded number
    find(withRoles: number) {

        return this.retrieve().then(modulesList => {

            if (withRoles == 1) {

                let roleModel = new RoleModel();
                return Promise.each(modulesList, (module) => {

                    return roleModel.findAllByAttributes({ module_id: module._id }).then(rolesList => {

                        let obj = {
                            _id: module._id,
                            name: module.name,
                            description: module.description,
                            status: module.status,
                            weight: module.weight,
                            roles: rolesList
                        }
                        this.modules.push(obj);
                    });
                }).then(allResult => {
                    return this.modules;
                })
            }
            else {
                return modulesList;
            }
        })
    }

    public getModulesForRole() {

        let myAry = [];

        // Find all modules
        return this.findAllByAttributes({ status: true }).then(result => {

            return Promise.each(result, (mod) => {

                let featuresAry = [];

                let moduleObj = {}
                moduleObj['module_id'] = mod._id;
                moduleObj['name'] = mod.name;

                // Find all * permissions
                return new PermissionModel().findAllByAttributes({ module_id: mod._id, action: "*" }).then(astericPermission => {

                    if (astericPermission.length) {


                        return Promise.each(astericPermission, ap => {

                            let featureObj = {}

                            featureObj['title'] = ap.title;

                            // Find all permissions of AP's *
                            return new PermissionModel().findAllByAttributes({ controller: ap.controller }).then(perms => {
                                if (perms.length) {

                                    _.each(perms, perm => {

                                        if (perm.action == "index") {
                                            featureObj['index_id'] = perm._id
                                        }
                                        if (perm.action == "update") {
                                            featureObj['update_id'] = perm._id
                                        }
                                        if (perm.action == "create") {
                                            featureObj['create_id'] = perm._id
                                        }
                                        if (perm.action == "delete") {
                                            featureObj['delete_id'] = perm._id
                                        }
                                    })
                                }
                                featuresAry.push(featureObj);

                            })
                        })
                    }
                }).then(ass => {
                    moduleObj['features'] = featuresAry;
                    myAry.push(moduleObj);

                })
            })

        }).then(asdf => {
                return myAry
            })
    }

}
export { ModuleModel };