import { Component, Input, AfterViewInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'validation-error',
    templateUrl: 'validation-error.component.html',
    styleUrls: ['validation-error.component.css']
})

/**
 * ValidationComponent Error Component will be used as child component to render errors of fields
 * Version: 1.0.0
 * how to use?
 * <validation-error 
 *      [control]="model.controls.name" 
 *      [error]="''" [label]="labels.name">
 * </validation-error>
 * 
 * @class ValidationComponent
 */

export class ValidationComponent {

    private _error: String = '';

    @Input() control: AbstractControl
    @Input() label: String
    @Input() error: String

    /** 
     ***Following code is not in use but in later can be used 
        
        @Input()
        set error(name: String) {
            this._error = this.getErrors(this.control, this.label);
        }

        get error(): String {
            return this._error;
        }
    **/


    /**
     * TODO:Low (will be need to track change)
     * NOT IN USE
     */
    ngAfterContentInit() { }

    /**
     * Not IN USE
     * This function wil render the errors of each field against error typee
     * @param control 
     * @param label 
     */
    public getErrors(control: AbstractControl, label: String): String {

        if (control.hasError('required')) {
            return `${label} is required`;
        }
        else if (control.hasError('email')) {
            return `Invalid Email Address`;
        }
        else if (control.hasError('maxlength')) {
            return `Maximum length  required is ${control.errors.maxlength.requiredLength}`;
        }
        else if (control.hasError('minlength')) {
            return `Minumum length required is  ${control.errors.minlength.requiredLength}`;
        }
        else if (control.hasError('unique')) {
            return `${label} already exists`;
        }
        else if (control.hasError('old_password_not_matched')) {
            return `${label} not match with existing password`;
        }
        return "";

    }



}