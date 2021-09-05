import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'lead-notes',
    templateUrl: 'lead-notes.component.html',
    styleUrls: ['lead-notes.component.css'],
})

export class LeadNotesComponent {

    public fg: FormGroup;
    public submitted: boolean; // keep track on whether form is submitted

    public componentLabels = { subject: 'Subject', note: 'Note', is_important: 'Important' }

    constructor(
        private _fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        try {
            // the short way
            this.fg = this._fb.group({
                subject: ['', [<any>Validators.required, <any>Validators.maxLength(55)]],
                note: ['', [<any>Validators.required]],
                is_important: ['']
            });
        }
        catch (e) {
            console.log(e);
        }

    }

    save(model, isValid: boolean) {

    }
}