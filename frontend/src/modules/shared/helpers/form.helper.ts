import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { _ } from 'lodash-node';

export class FormHelper {
    public groupForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    public componentLables = {}

    constructor(_groupForm: FormGroup, _component_labels: Object) {
        this.groupForm = _groupForm;
        this.componentLables = _component_labels;
    }
    /**
     * A helper function for tracking form changes 
     * will be used for one field 
     *  e.g email verification
     * Run time subscribe changes
     */
    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.groupForm.statusChanges;
        const myFormValueChanges$ = this.groupForm.valueChanges;

        myFormStatusChanges$.subscribe(x => {
            this.groupForm.valid

        });

    }

    //---
    //ToDo: low (not in use )
    // public formErrors(submitted:boolean): FormError[] {
    //     if (submitted && this.groupForm.errors) {
    //         return this.getErrors(this.groupForm);
    //     }
    // }

    /**
    * 
    * @param name 
    */
    public resetFieldErrors(name: string): void {
        this.groupForm.get(name).setErrors(null);
    }

    /**
     * 
     * @param name 
     * @param submitted 
     */
    public fieldErrors(name: string, submitted: boolean): String {
         
        let control = this.groupForm.get(name);
        
        if (control && (control.touched || this.submitted) && control.errors) {
            return this.getErrors(control, this.componentLables[name]);
        } else {
            return undefined;
        }
    }
    /**
     * 
     * @param name 
     * @param otherLabel 
     * @param submitted 
     */
    public groupFieldErrors(name: string,other_control:string, submitted: boolean): String {
         
        let control = this.groupForm.get(name);
        
        if (control && (control.touched || this.submitted) && control.errors) {
            return this.getErrors(control, this.componentLables[name],this.componentLables[other_control]);
        } else {
            return undefined;
        }
    }
    /**
     * 
     * @param control 
     * @param label 
     */
    public getErrors(control: AbstractControl, label: String,otherLabel?:string): String {
        // console.log(control.errors.nomatch);
        // console.log(label);
        console.log('--------');
      
        if (control.hasError('required')) {
            return `${label} is required`;
        }
        else if (control.hasError('email')) {
            return `Invalid Email Address`;
        }
        else if (control.hasError('nomatch')) {
            return `${label} and ${otherLabel} must match`;
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
        // //server side errors
        // else if (control.errors != undefined) {
        //     return `${label} ${control.errors['error']}`;
        // }

    }

    /**
   * ToDo:low (code optimzation)
   * @param error 
   */
    public handleSubmitError(error: any): void {

        if (error.status === 404) {
            console.log(error);
            const error_resp = error.body;
            for (let ob in error_resp) {
            
                let field = _.first(Object.keys(error_resp[ob] || {}));
                let error_type = error_resp[ob]['kind'];
                let errors = {};
                errors[error_type] = true;
                this.groupForm.get(field).setErrors(errors);
            }
        }
    }

}