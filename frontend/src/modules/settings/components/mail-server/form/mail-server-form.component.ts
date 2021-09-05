import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdLoadingService, TdDialogService } from '@covalent/core';

import { FormHelper } from 'modules/shared/helpers/form.helper'
import { MailServer } from 'modules/settings';
import { MailServerService } from 'modules/settings/';
import { LayoutService } from 'modules/layout/services/layout.service';
import { FormValidator } from 'modules/settings/validators/form-validator'
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'mail-server-form-page',
    templateUrl: 'mail-server-form.component.html',
    styleUrls: ['mail-server-form.component.css']
})
export class MailServerFormComponent implements OnInit {
    //for overlay loading tracking 
    private overlayStarSyntax: boolean = false;


    public pageAction: string;

    public formHelper: FormHelper
    public mailServerForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private mailServer: MailServer;
    public pageTitle: string
    public editMode: boolean = true;
    public componentLabels = { host: 'Host', port: 'Port', is_gmail: 'Gmail Based', }




    constructor(
        private _fb: FormBuilder, private _mailServerService: MailServerService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        private _loadingService: TdLoadingService,
        private _dialogService: TdDialogService,
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
                host: ['', []],
                port: ['', []],
                user_name: ['', [<any>Validators.required, <any>Validators.maxLength(50)]],
                password: ['', [<any>Validators.required, <any>Validators.maxLength(50)]],
                description: [''],
                is_gmail: [false]
            });
            //set form helper
            this.formHelper = new FormHelper(this.mailServerForm, this.componentLabels);

            // TODO:low: update actions from string to enum...
            if (this.pageAction == "view") {
                this.setRecord();
                this._disableForm(true);
            }
            else if (this.pageAction == "update") {
                this.setRecord();
                this._disableForm(false);
            }
            else if (this.pageAction == "create") {
                this._redirectToFirstConfiguration();
            }
        }
        catch (e) {
            console.log(e);
        }

    }

    /**
     * Disable the form and hide the action buttons
     * @param status 
     */
    private _disableForm(status: boolean) {
        if (status == true) {
            this.mailServerForm.disable();
        }
        else {
            this.mailServerForm.enable();
        }
        this.editMode = !status;
    }

    /**
     * TODO:Low refinement
     * Set Mail Server based on 
     */
    setRecord(): void {

        this._loadingService.register('overlayStarSyntax');

        this.route.params.subscribe(
            params => {

                let recordId = params['id'];
                this._mailServerService.findByID(recordId).
                    subscribe(
                    mailServer => {

                        this.mailServer = mailServer;

                        this.menuService.setBreadCrumb([
                            { url: '/dashboard', title: 'Dashboard' },
                            { url: '/settings/mail-servers', title: 'Mail Server configuration' },
                            { title: this.mailServer.title },
                        ])

                        this.mailServerForm.reset();
                        this.mailServerForm.patchValue(mailServer);
                        this.verifyGmailBased();
                        this._loadingService.resolve('overlayStarSyntax')

                    },
                    error => {
                        this._loadingService.resolve('overlayStarSyntax');
                    })


            });

    }
    /**
     * Redirect to first found setting 
    */
    private _redirectToFirstConfiguration(): void {
        this._mailServerService.index().
            subscribe(
            response => {
                if (response['totalCount'] > 0) {
                    this.router.navigate(['/settings/mail-servers/update/', response['mailServers'][0]['_id']]);
                }
                else {
                    this._disableForm(false);
                }
            })
    }


    save(model: MailServer, isValid: boolean) {

        this.submitted = true;


        if (isValid) {
            this._loadingService.register('overlayStarSyntax');

            this._mailServerService.save(model, this.mailServer).subscribe(resp => {
                this.mailServerForm.reset();
                this.snackBar.open("Date saved", "MailServer", {
                    duration: 1000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this._loadingService.resolve('overlayStarSyntax');
                    this.router.navigate(['/settings/mailServers', resp['_id']]);
                });

            }, error => {
                this._loadingService.resolve('overlayStarSyntax');
                this.formHelper.handleSubmitError(error);
            })
        }
    }
    /**
     * It if Gmail checkbox is true then no need of Host and Port
     */
    verifyGmailBased() {
        if (this.mailServerForm.get('is_gmail').value) {
            this.mailServerForm.get('host').disable();
            this.mailServerForm.get('port').disable();
            this.mailServerForm.get('host').setValue('');
            this.mailServerForm.get('port').setValue('');
        }
        else {
            this.mailServerForm.get('host').enable();
            this.mailServerForm.get('port').enable();
        }
    }
    /**
    * Set overlay toggle tracking
    */
    private toggleOverlayStarSyntax(): void {
        if (!this.overlayStarSyntax) {
            this._loadingService.register('overlayStarSyntax');
        } else {
            this._loadingService.resolve('overlayStarSyntax');
        }
        this.overlayStarSyntax = !this.overlayStarSyntax;
    }
}