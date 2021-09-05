import { Directive } from '@angular/core';
import { AbstractControl, FormControl, NgControl } from '@angular/forms';
@Directive({
  selector: '[validate-onblur]',
  host: {
    '(focus)': 'onFocus($event)',
    '(blur)': 'onBlur($event)'
  }
})
export class ValidateOnBlurDirective {
  private validators: any;
  private asyncValidators: any;
  private hasFocus = false;

  constructor(public formControl: NgControl) {
  }

  onFocus($event) {

    // this.formControl.control.markAsUntouched(false);
    // this.formControl.control.markAsPristine(false);
  }

  onBlur($event) {

    // this.formControl.control.markAsTouched(true);
    // this.formControl.control.markAsPristine(true);
  }
}