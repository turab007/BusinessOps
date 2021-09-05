import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'lead-attachments',
    templateUrl: 'lead-attachments.component.html',
    styleUrls: ['lead-attachments.component.css'],
})

export class LeadAttachmentsComponent {

    public files: any;
    public disabled: boolean = false;
    public submitted: boolean; // keep track on whether form is submitted

    public fg: FormGroup;

    public componentLabels = { title: 'Title', attachments: 'Files', is_important: 'Important' }

    constructor(
        private _fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        try {
            // the short way
            this.fg = this._fb.group({
                title: ['', [<any>Validators.required, <any>Validators.maxLength(55)]],
                attachments: ['', [<any>Validators.required]],
                is_important: ['']
            });
        }
        catch (e) {
            console.log(e);
        }

    }

    public toggleDisabled(): void {
        this.disabled = !this.disabled;
    }

    save(model, isValid: boolean) {

    }
}