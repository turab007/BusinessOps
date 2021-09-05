import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { MailServerTest } from 'modules/settings';
import { MailServerService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'mail-server-test-page',
    templateUrl: 'mail-server-test.component.html',
    styleUrls: ['mail-server-test.component.css']
})
export class MailServerTestComponent implements OnInit {
    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public mailServerForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    public pageTitle: string
    public componentLabels = { email: 'Email Address' }



    constructor(
        private _fb: FormBuilder, private _mailServerService: MailServerService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private menuService: LayoutService
    ) {
        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'MailServers'
        this.menuService.setMenu(menuArr);
    } // form builder simplify form initialization

    ngOnInit() {
        try {
            this.pageAction = this.route.snapshot.data.action;
            this.pageTitle = this.route.snapshot.data['title'];


            // the short way
            this.mailServerForm = this._fb.group({
                email: ['', [<any>Validators.required, <any>Validators.email]],
            });
            console.log(this.mailServerForm);
            //set form helper
            this.formHelper = new FormHelper(this.mailServerForm, this.componentLabels);

        }
        catch (e) {
            console.log(e);
        }

    }

    send(model: MailServerTest, isValid: boolean) {

        this.submitted = true;
        if (isValid) {
            this._loadingService.register('overlayStarSyntax');

            this._mailServerService.testMail(model.email).subscribe(resp => {
                this.mailServerForm.reset();
                this.snackBar.open("Email Sent successfully", "MailServer", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');
                    this.router.navigate(['/settings/mail-servers/create']);
                });

            }, error => {
                this._loadingService.resolve('overlayStarSyntax');
                this.formHelper.handleSubmitError(error);
            })
        }
    }
}