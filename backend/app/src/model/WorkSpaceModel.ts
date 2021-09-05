/// <reference path="../../_all.d.ts" />
import { _ } from 'lodash-node'
import Promise = require('bluebird');
import WorkSpaceRepository = require("./../dal/repository/WorkSpaceRepository");
import IWorkSpaceModel = require("./interfaces/IWorkSpaceModel");
import IUserModel = require("./interfaces/IUserModel");
import UserModel = require("./UserModel");
import { AppletModel } from "./barrel/";
import BaseModel = require("./base/BaseModel");

/**
 * WorkSpace Model
 * 
 * @class WorkSpaceModel
 */
class WorkSpaceModel extends BaseModel<IWorkSpaceModel> {

    private _wsRepository: WorkSpaceRepository;

    constructor() {
        super(new WorkSpaceRepository());
        this._wsRepository = this._repo;
    }

    /**
     * Whenever any workspace is created List will be default applet 
     * @param item 
    */
    create(item: IWorkSpaceModel) {
        return super.create(item).then(ws => {
            let appletPromise = new AppletModel().findByAttribute({ 'name': 'Lists' });
            return this.pushApplets(ws._id, appletPromise).then(p => {
                return ws;
            })
        })
    }

    /**
     * Create Personal workspace for User
    */
    public createPersonalWorkSpace(user: IUserModel) {
        let user_id = user._id;
        let ws = <IWorkSpaceModel>{ name: 'Personal Workspace', space_type: 'Personal', created_by: user_id, updated_by: user_id }
        return this.create(ws);
    }

    /**
     * Update the many to many referecnes
     * @param _id 
     * @param item 
     */
    public updateByReferences(_id: string, item: IWorkSpaceModel) {
        return this.beforeUpdate(_id, item);
    }
    /**
     * For management of relations , implemented 
     * @param _id 
     * @param string 
     * @param item 
     */
    private beforeUpdate(_id: string, item: IWorkSpaceModel) {
        return this.findById(_id).then(record => {
            //getting unique users
            item.users = this.mongoIdstostringIds(_.union(item.users, record.users), true);
            item.roles = this.mongoIdstostringIds((_.union(item.roles, record.roles)), true);
            item.modules = this.mongoIdstostringIds((_.union(item.modules, record.modules)), true);
            return super.update(_id, item);
        })
    }
    /**
     *  get selected workspaces when needed 
     * @param workSpaces 
     * @param user_id 
     */
    public getSelectedWorkSpaces(workSpaces: any[], user_id: string) {
        let cond = {
            $or: [

                // {
                //     $and: [
                //         { '_id': { $exists: true } },
                //         { '_id': { $ne: null } },
                //         { '_id': { $in: workSpaces } },
                //     ]
                // },
                { created_by: user_id },
                { user_role: { $elemMatch: {_id:{ $gte: user_id} } } }


            ]
        }
        console.log('get ws cond-----------------------------------------------', cond);
        return this.findAllByAttributes(cond).populate(['created_by']);
    }
    /**
     * push the workSpace for selected user
     * @param _id 
     * @param userPromise : Promise 
     */
    public pushWorkSpace(_id: string, userPromise, role) {

        // console.log('-----------id and promise----------', _id, userPromise);
        let p2 = this.findById(_id); // WorkSpace

        let p1 = userPromise; //current user, who wants to associate

        return Promise.all([p1, p2]).then(res => {
            let user = res[0]; let ws = res[1];

            //preparing promises

            if (role) {
                p1 = this.addeManytoManyRelation(_id, { $push: { user_role: { _id: user._id, role: role } } });
                p2 = new UserModel().addeManytoManyRelation(user._id, { $push: { work_spaces: ws._id } });

            }
            else {
                p1 = this.addeManytoManyRelation(_id, { $push: { users: user._id } });
                p2 = new UserModel().addeManytoManyRelation(user._id, { $push: { work_spaces: ws._id } });

            }

            // let p2 = new UserModel().addeManytoManyRelation(user._id, { $push: { work_spaces: ws._id } });

            return Promise.all([p1, p2]).then(output => {
                console.log('========================this is the output==================', output);
                return output[0];
            })
        });
    }
    /**
     * 
     * Tradational method to insert relations in database
     * @param _id 
     * @param userPromise : Promise 
     */
    updateAndPushWorkSpace(_id: string, userPromise) {
        let p1 = userPromise; //current user, who wants to associate
        let p2 = this.findById(_id); // WorkSpace

        return Promise.all([p1, p2]).then(res => {
            let user = res[0];
            let ws = res[1];
            //prepare items 

            let wsItem = <IWorkSpaceModel>{ users: this.mongoIdstostringIds(_.union(ws.users, [user._id]), true) };
            let userItem = <IUserModel>{ work_spaces: this.mongoIdstostringIds(_.union(user.workSpace, [_id]), true) };

            let p1 = this.update(_id, wsItem);
            let p2 = new UserModel().update(user._id, userItem);

            return Promise.all([p1, p2]).then(output => {
                return output[0];
            })
        });
    }

    updateWorkSpace(_id: string, user, role) {
        let p2 = this.findById(_id); // WorkSpace

        let p1 = user; //current user, whose role we want to update

        return Promise.all([p1, p2]).then(res => {
            let user = res[0];
            let ws = res[1].toJSON();
            
            //finding user in user_role array in workspace
            ws.user_role.forEach(u_role => {
                if (u_role._id == user._id) {
                    // console.log('===================user found===================');
                    u_role.role = role; //updating role in local object
                }
                // console.log('===================this is ws====================', ws);

            });

            delete ws._id; //DELETE _ID BECAUSE MOD ON _ID IS NOT ALLOWED 
            
            console.log("After Deletion",ws)
            p1 = this.findByIdAndUpdate(_id, ws);
            return Promise.all([p1, p2]).then(output => {
                return output[0];
            })
        });
    }



    /**
     * Remove workspace assingnement if not owner otherwise simply remove
     * @param _id 
     * @param userPromise 
    */
    public removeWorkSpaceAssignment(_id: string, userPromise) {
        let p1 = this.findById(_id);
        let p2 = userPromise; //current user
        return Promise.all([p1, p2]).then(res => {
            // res[0] is Workspace 
            // and res[1] is User

            if (res[0].created_by == res[1]._id) {
                //it means its current user owner , only delete
                return this.delete(_id);
            }
            else {

                let p1 = this.removeManytoManyRelation(_id, { $pull: { user_role: { _id: res[1]._id } } });
                let p2 = new UserModel().removeManytoManyRelation(res[1]._id, { $pull: { work_spaces: _id } });

                return Promise.all([p1, p2]).then(output => {
                    return output[0];
                })
            }
        })

    }

    /**
     * push the workSpace for selected workspace
     * @param _id (workspace id)
     * @param userPromise : Promise 
    */
    public pushApplets(_id: string, appletPromise) {
        let p1 = appletPromise; //Applet , who wants to associate
        let p2 = this.findById(_id); // WorkSpace

        return Promise.all([p1, p2]).then(res => {
            let applet = res[0]; let ws = res[1];

            //preparing promises

            let p1 = this.addeManytoManyRelation(_id, { $push: { modules: applet._id } });
            let p2 = new AppletModel().addeManytoManyRelation(applet._id, { $push: { work_spaces: ws._id } });

            return Promise.all([p1, p2]).then(output => {
                return output[0];
            })
        });
    }

    /**
     * Remove apllets assingnement if not owner otherwise simply remove
     * @param _id 
     * @param appletPromise 
    */
    public pullApplets(_id: string, appletPromise) {
        let p1 = this.findById(_id);
        let p2 = appletPromise; //applet user
        return Promise.all([p1, p2]).then(res => {
            // res[0] is Workspace 
            // and res[1] is Applet

            let p1 = this.removeManytoManyRelation(_id, { $pull: { modules: res[1]._id } });
            let p2 = new AppletModel().removeManytoManyRelation(res[1]._id, { $pull: { work_spaces: _id } });

            return Promise.all([p1, p2]).then(output => {
                return output[0];
            })

        })

    }


}

Object.seal(WorkSpaceModel);
export { WorkSpaceModel };