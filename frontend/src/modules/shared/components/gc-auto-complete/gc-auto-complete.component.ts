import { Component, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
    selector: 'gc-auto-complete',
    templateUrl: 'gc-auto-complete.component.html',
    styleUrls: ['gc-auto-complete.component.css'],

})

/**
 * MultiSelector component will be used to handle has many relations in the form checkbox
 * Version: 1.0.0
 * how to use?
 * <gc-auto-complete
 *      [service]="_contactService"
 *      [label]="placeHolder"
 *      [keyControlName]="'contact_id'" // (it can be formControlName)
 *      [titleControlName]="'contact_id_title'" // (it can be formControlName)
 *      [Control]="leadForm.controls.contact_id"
 *      [required]="required"  
 *      [responseKey]="contacts"  
 *      [gcFormGroup]="leadForm"
 *      [nameKey] = "first_name"  
 *      [idKey] = "_id"  
 *      [populatedFields] = {company_id: 'company'} // first value is componet name and other is response key 
 *      (selectedAutoCompleteItem)="setSelectedAutoCompleteItem($event)"  
 * 
 *      [checkBox]="true" [checkBoxValue]="'existing'" [model] = "lead" [isChecked] = false (optional or specific to business requirements)
 *  >
 * </gc-auto-complete>
 * 
 * 
 * 
 * @class GcAutoCompleteComponent
 */

export class GcAutoCompleteComponent {


    @Input() service: any
    @Input() method: string
    @Input() label: String
    @Input() responseKey: string
    @Input() control: AbstractControl
    @Input() keyControlName: string
    @Input() titleControlName: string
    @Input() required: boolean = false;
    @Input() gcFormGroup: FormGroup
    @Input() nameKey: string = "name"
    @Input() idKey: string = "_id"
    @Input() populatedFields: any[];
    //special condition that only some custom component will use 
    @Input() checkBox: boolean = false // optional
    @Input() checkBoxValue: string = ""; // optional
    @Input() model; // optional
    @Input() isChecked: boolean = false; // optional

    @Output() selectedAutoCompleteItem = new EventEmitter<any>();

    options: any[];
    queryStrings: Object = { filter: {}, select: {} };

    /**
     * Use to send all subscribe changes
     */
    ngAfterContentInit() {
        if (!this.method) {
            this.method = 'index_paged'
        }
        this.subscribeControlChanges();

    }
    /**
     * Subscribe changes against field
     */
    private subscribeControlChanges() {
        return this.control.valueChanges
            .debounceTime(100)
            .subscribe(value => {
                console.log(value);
                return this.setAutoCompleteOptions(value);
                //TODO Low: by default it will access indexed_page 


            });
    }
    /**
     * An observable will call the service from Service module and fetch the results
     * @param value 
     */
    private setAutoCompleteOptions(value: string) {

        this.queryStrings['filter'][this.nameKey] = value;
        return this.service[this.method](this.queryStrings).subscribe(
            response => {
                if (this.responseKey) {
                    this.options = response[this.responseKey];
                }
                else {
                    this.options = response;
                }

                return response;
            },
            error => console.log(error)
        ) // end 
    }
    /**
     * Call back method for selecting other fields values from json object
     * @param option 
     */
    private onSelect(event, option: Object): void {
        this.gcFormGroup.get(this.keyControlName).setValue(option[this.idKey]);
        if (this.populatedFields) {
            //populate fields 
            for (var kf in this.populatedFields) {
                if (option[this.populatedFields[kf]]) {
                    this.gcFormGroup.get(kf).setValue(option[this.populatedFields[kf]]);
                }
                else {
                    this.gcFormGroup.get(kf).setValue("");
                }
            }

        }
        //emiting data to parent component
        return this.selectedAutoCompleteItem.emit({ data: option, controlName: this.keyControlName })
    }
}