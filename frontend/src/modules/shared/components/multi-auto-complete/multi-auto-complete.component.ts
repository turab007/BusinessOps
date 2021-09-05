import { Component, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import _ from "lodash-node";
@Component({
    selector: 'multi-auto-complete',
    templateUrl: 'multi-auto-complete.component.html',
    styleUrls: ['multi-auto-complete.component.css'],

})

/**
 * MultiSelector component will be used to handle has many relations in the form checkbox
 * Version: 1.0.0
 * how to use?
 * <multi-auto-complete
 *      [model]="lead" 
 *      [label]="Participants"
 *      [controlName]="controlName" (it can be formControlName) e.g participants
 *      [control]="fg.controls.controlName" //e.g leadForm.controls.participants
 *      [required]="required"  
 *      [readonly]="false"  
 *      [msFormGroup]="leadForm"      
 *      [getSelectedMethod]="getSelectedMethod"      
 *      [getAutoCompleteMethod]="getAutoCompleteMethod"      
 *      
 *  >
 * </multi-auto-complete>
 * 
 * For selectedItems method 'setChangedItems' whatever you name like in parent component, but the syntax and 
 * parmeters should be like that
 * 
 * 
 * 
 * @class MultiAutoCompleteComponent
 */

export class MultiAutoCompleteComponent {

    @Input() model: any
    @Input() label: String
    @Input() control: AbstractControl
    @Input() controlName: string
    @Input() required: boolean = false;
    @Input() readonly: boolean = false;
    @Input() msFormGroup: FormGroup
    @Input() service: any // For now service that provided should have two methods (getSelected,getAutoComplete)

    //input methods for loading pre selected data and auto complete data
    @Input() getSelectedMethod:string = "getSelected";
    @Input() getAutoCompleteMethod:string = "getAutoComplete";
    

    public not_in_ids: any = [];
    public queryStrings: Object = { filter: {}, select: {}, filter_not_in: { '_id': [] } };

    //-----------Objects that will be filtered at auto complete service --------------//
    filteredObjects: string[];

    objectsModel: string[] = []

    ngOnInit(): void {
        if (this.model && this.model[this.controlName]) {
            this.queryStrings['filter'] = { '_ids': this.model[this.controlName] };

            /** TODO: low getSelected is hard coded right now, will be dynamic in future */
            console.log(this.service);
            this.service[this.getSelectedMethod](this.queryStrings).subscribe(
                response => {
                    
                    this.objectsModel = response
                    this.not_in_ids = _.map(response, '_id');
                    this.filterObjects('');
                },
                error => console.log(error)
            ) // end 
        }
        else {
            //for create mode
            this.filterObjects('');
        }

        
    }
    /**
     * prepare data auto from server
     * @param value 
     */
    filterObjects(value: string): void {

        this.queryStrings['filter']['name'] = value;
        this.queryStrings['filter_not_in']['_id'] = this.not_in_ids;
        
        /** TODO: low getAutoComplete is hard coded right now, will be dynamic in future */
        return this.service[this.getAutoCompleteMethod](this.queryStrings).subscribe(
            response => {
                this.filteredObjects = response;
            },
            error => console.log(error)
        ) // end 
    }
    /**
     * Add event callin back
     * @param ev 
     */
    addEvent(event: string) {
        this.not_in_ids = _.map(this.objectsModel, '_id');
        this.control.patchValue(this.not_in_ids);
    }
    /**
     * 
     * @param event 
     */
    removeEvent(event: string) {
        this.not_in_ids = _.map(this.objectsModel, '_id');
        this.control.patchValue(this.not_in_ids);
    }

}