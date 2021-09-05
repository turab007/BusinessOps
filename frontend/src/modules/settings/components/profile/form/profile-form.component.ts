import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { FormValidator } from './../../../validators/form-validator'
import { FormHelper } from './../../../../shared/helpers/form.helper'
import { Profile } from './../../../view-models/profile';
import { FormError } from './../../../view-models/form-error';
import { ProfileService } from './../../../services/profile.service';
import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

@Component({
    selector: 'profile-form-page',
    templateUrl: 'profile-form.component.html',
    styleUrls: ['profile-form.component.css']
})

export class ProfileFormComponent implements OnInit {
    public formHelper: FormHelper
    public profileForm: FormGroup; // our model driven form
    public submitted: boolean; // keep track on whether form is submitted
    private profile: Profile;
    public pageTitle: string
    public pageAction: string;
    public editMode: boolean = false;
    public componentLables = { 'first_name': 'First Name', 'last_name': 'Last Name' }

    constructor(
        private _fb: FormBuilder, private _profileService: ProfileService,
        private route: ActivatedRoute, private router: Router,
        private menuService: LayoutService,
        public snackBar: MatSnackBar) {

        //TODO:Low (Take this to centeral place)
        menuArr['sub_module'] = 'Business Groups'
        this.menuService.setMenu(menuArr);

    } // form builder simplify form initialization

    ngOnInit() {
        try {

            this.pageTitle = this.route.snapshot.data['title'];
            this.pageAction = this.route.snapshot.data.action;
            console.log(this.pageAction);

            // the short way
            this.profileForm = this._fb.group({
                first_name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
                last_name: ['', [<any>Validators.required, <any>Validators.maxLength(25)]],
            });

            this._profileService.getProfile().subscribe(
                user => {
                    console.log(user);
                    this.profileForm.patchValue(user);
                },
                error => console.log(error)
            )
            // TODO:low: update actions from string to enum...
            if (this.route.snapshot.data.action == "view") {
                this._disableForm(true);
            }
            else if (this.route.snapshot.data.action == "update") {
                this._disableForm(false);
            }

            //set form helper
            this.formHelper = new FormHelper(this.profileForm, this.componentLables);

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
            this.profileForm.disable();
        }
        else {
            this.profileForm.enable();
        }
        this.editMode = !status;
    }




    save(model: Profile, isValid: boolean) {
        this.submitted = true;

        if (isValid) {


            this._profileService.save(model).subscribe(resp => {

                this.snackBar.open("Date saved", "Profile", {
                    duration: 2000,
                }).afterDismissed().subscribe(() => {
                    //redirecting to user
                    this.router.navigate(['/settings/profile']);
                });

            }, error => {

                this.formHelper.handleSubmitError(error);
            })
        }
    }

    redirectGitHub() {
        window.location.href = "https://github.com/login/oauth/authorize?scope=user:email&client_id=461e2b6455eaaa0ff0a1";
    }

    redirectGitLab() {
        window.location.href = "https://gitlab.vteamslabs.com/oauth/authorize?client_id=012d22ca117b19fd214d1e9791f4b29f5d116752c2645b258186925fb0619ca0&redirect_uri=http://dev-gc.vteamslabs.com/gitlabcallback&response_type=code";
    }


}