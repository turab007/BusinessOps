import { Component, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
    selector: 'multi-selector',
    templateUrl: 'multi-selector.component.html',
    styleUrls: ['multi-selector.component.css'],

})

/**
 * MultiSelector component will be used to handle has many relations in the form checkbox
 * Version: 1.0.0
 * how to use?
 * <multi-selector
 *      [data]="data" 
 *      [preSelected]="selected"
 *      [label]="placeHolder"
 *      [controlName]="controlName" (it can be formControlName)
 *      [Control]="controlName"
 *      [required]="required"  
 *      [msFormGroup]="leadForm"      
 *      (selectedItems)="setChangedItems($event)"
 *      
 *  >
 * </multi-selector>
 * 
 * For selectedItems method 'setChangedItems' whatever you name like in parent component, but the syntax and 
 * parmeters should be like that
 * 
 *      setChangedItems(obj: any[], controlName: string) {
 *           this.leadForm.get(controlName).setValue(obj);
 *           console.log(obj);
 *      }
 * 
 * 
 * @class MultiSelectorComponent
 */

export class MultiSelectorComponent {


    @Input() data: any[]
    @Input() label: String
    @Input() control: AbstractControl
    @Input() controlName: String
    @Input() preSelected: any[]
    @Input() required: boolean = false;
    @Input() msFormGroup: FormGroup

    @Output() selectedItems = new EventEmitter<any>();

    /**
     * Use to send all subscribe changes
     */
    ngAfterContentInit() {

        return this.control.valueChanges
            .debounceTime(100)
            .subscribe(data => {
                return this.selectedItems.emit({ data: data, controlName: this.controlName })

            });
    }

}