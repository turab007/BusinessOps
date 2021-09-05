import { _ } from 'lodash-node';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CovalentChipsModule } from '@covalent/core';

import { BusinessGroupService, BusinessGroup } from './../../../../';

@Component({
    selector: 'user-business-groups-component',
    templateUrl: 'user-business-groups.component.html',
    styleUrls: ['user-business-groups.component.css'],
    providers: [BusinessGroupService]
})
export class UserBusinessGroupsComponent { 
 /**
     * Get page action (view or else) from parent component for enabling/disabling form components (checkboxes)
     */
    @Input('pageAction') pageAction: string;

    /**
     * To deisable/enable fields (checkboxes)
     */
    public readOnly: boolean;


    /**
     * Push Group to parent component
     */
    @Output() pushGroup = new EventEmitter<any[]>();

    /**
     * Get json array of roles assigned to users from parent component
     */
    @Input('userBusinessGroups') userBusinessGroups: any[];

    /**
     * Json Aray of modules
     */
    public businessGroups: BusinessGroup[];
    public businessGroupNames: string[];
    public userBusinessGroupNames: string[] = [];

    /**
     * @constructor
     * @param _businessGroupService BusinessGroupService
     */
    constructor(private _businessGroupService: BusinessGroupService) { }


    /**
     * On Init
     */
    ngOnInit() {

        this.readOnly = (this.pageAction == "view") ? true : false;

        this._getBusinesGroups();

    }

    /**
     * Get json array of modules with Business Groups.
     */
    private _getBusinesGroups() {

        this._businessGroupService.index().subscribe((result) => {
           
            if (result) {
                this.businessGroups = result['groups'];
                this.businessGroupNames = _.map(result['groups'], 'name');

                this.userBusinessGroupNames = [];
                
                _.each(this.businessGroups, group => {
                    //TODO:Low
                    if (this.userBusinessGroups && this.userBusinessGroups.indexOf(group._id) >= 0) {
                        this.userBusinessGroupNames.push(group.name);
                    }
                })

                console.log(this.businessGroupNames);

                this.setBusinessGroupCheckedStatus();
            }

        }, error => {
            console.log(error);
        });
    }

    /**
     * Set Business Group Checkd status to true or fallse
     * check if Business Group is assigned to user then set isAsigned to true
     * 
     */
    private setBusinessGroupCheckedStatus() {

        _.each(this.businessGroups, businessGroup => {
            if (this.userBusinessGroups && this.userBusinessGroups.indexOf(businessGroup._id) >= 0) {
                businessGroup['checked'] = true;
            }
        })
    }

    /**
     * Prepare userBusinessGroupObj [businessGroup_id, user_id] after checking if it is not already existed in this.userBusinessGroups array.
     * If it already existed then remove it from array. (Rmove it if checkbox is uncheckd on click)
     * 
     * @param module_id string
     * @param businessGroup_id string
     */
    emitBusinessGroup() {
        
        this.userBusinessGroups = [];

        _.each(this.userBusinessGroupNames, businessGroupName => {
            _.each(this.businessGroups, businessGroup => {
                if(businessGroup.name == businessGroupName){
                    this.userBusinessGroups.push(businessGroup._id);
                }
            })
        })

        this.pushGroup.emit(this.userBusinessGroups);

    }
}