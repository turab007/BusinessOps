/// <reference path="../../_all.d.ts" />
import Promise = require('bluebird');
import _ = require('lodash-node');
import UserBusinessGroupRepository = require("./../dal/repository/UserBusinessGroupRepository");
import IUserBusinessGroupModel = require("./interfaces/IUserBusinessGroupModel");
import BaseModel = require("./base/BaseModel");


/**
 * UserBusinessGroup Model
 * 
 * @class UserBusinessGroupModel
 */
class UserBusinessGroupModel extends BaseModel<IUserBusinessGroupModel> {

    constructor() {
        super(new UserBusinessGroupRepository());
    }

    /**
     * Crate UserBusinessGroups on the bases of provided businessGroups array, which should contain business_group_id
     * 
     * @param user_id string
     * @param business_groupsIds any[]
     */
    public createUserBusinessGroups(user_id: string, businessGroupsIds: any[]) {

        return Promise.each(businessGroupsIds, (business_group_id) => {
            // Check user group does not exist already
            return this.findByAttribute({ user_id: user_id, business_group_id: business_group_id }).then(savedBusinessGroups => {

                if (!savedBusinessGroups) {
                    // create new user business Group
                    let userBusinessGroup: IUserBusinessGroupModel = {
                        user_id: user_id,
                        business_group_id: business_group_id
                    }
                    return this.create(userBusinessGroup);
                }
            });
        });
    }

    /**
     * Delete all saved user-business-groups which are not available in (submitted/provided) roles array.
     * 
     * @param user_id string
     * @param businessGroupIds any[]
     */
    public deleteUserBusinessGroupsIfNotInAry(user_id: string, businessGroupIds: any[]) {

        // Find all saved user-business-group of user_id
        return this.findAllByAttributes({ user_id: user_id }).then(userBusinessGroupsList => {

            // If we found any user-business-group
            if (userBusinessGroupsList.length > 0) {

                // Then iterate through each userBusinessGroupList
                return Promise.each(userBusinessGroupsList, (userBusinessGroup) => {

                    // To check if it (saved) is not available in posted array (businessGroups)
                    let deletIt: boolean = true;

                    // Check if it (saved) is not available in posted array (businessGroups)
                    for (let index = 0; index < businessGroupIds.length; index++) {

                        if (userBusinessGroup.business_group_id == businessGroupIds[index]) {
                            deletIt = false;
                        }
                    }

                    // TODO:low: May29: There should be one delte query instead of multiple via looping
                    // if not found then delete it.
                    if (deletIt == true) {
                        return this.delete(userBusinessGroup._id.toString());
                    }

                })
            }
            // If not found anything return.
            return userBusinessGroupsList;
        })
    }



    /**
     * This method is responsible for getting user roles and converting their ids (primary keys) into array and returning it.
     * 
     * @param user_id string (user primary key)
     * @return any[]
     */
    public getUserBuessinessIdsArray(user_id: string) {

        return new UserBusinessGroupModel().findAllByAttributes({ user_id: user_id }).then(userBusinessGroupList => {

            if (userBusinessGroupList.length > 0) {

                return _.map(userBusinessGroupList, 'business_group_id');
            }
        })
    }


}

Object.seal(UserBusinessGroupModel);
export { UserBusinessGroupModel };