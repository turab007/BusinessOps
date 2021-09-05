import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'account-contact-modes-component',
    templateUrl: 'contact.modes.component.html',
    styleUrls: ['contact.modes.component.css'],
})
export class AccountContactModesComponent {
    @Input() myForm: FormGroup; // This component is passed a FormGroup from the base component template
    @Input() editMode: boolean;


    ngOnInit() {
        if (this.editMode) {
            this.myForm.enable();
        }
        else {
            this.myForm.disable();
        }
    }
}