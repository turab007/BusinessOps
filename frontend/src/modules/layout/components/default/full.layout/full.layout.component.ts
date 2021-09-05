import { Component, Renderer, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

import { LoginService } from 'modules/login/services/login.service';
import { LayoutService, FlashService, TokenService, SideNavService } from '../../../';


import { ProfileService, User } from '../../../../settings'

@Component({
    selector: 'app-main-full',
    templateUrl: 'full.layout.component.html',
    styleUrls: ['full.layout.component.css', '../stylesheets/layout-styles.css'],
    providers: [ProfileService]

})
export class FullLayoutComponent implements OnDestroy, OnInit {


    /**
     * user_id will be fetched from local storage
     * 
     */
    public user_id: string;

    /**
     * menu array for populate menus of module and it's title
     */
    public menuArr: any;

    public breadCrumbs: any[];

    public mediaOpen: boolean = true;

    /**
     * For managing the unsubscription on destroy
     */
    subscriptionMenu: Subscription;
    // Bread Crumb
    subscriptionBC: Subscription;

    // Flash message
    subscriptionFlash: Subscription;

    // Nav
    subscriptionNav: Subscription;

    public loggedInUser: User; //LOGGED IN USER

    /**
     * 
     * @constructor
     */
    constructor(

        private flashService: FlashService,
        private _loginService: LoginService,
        private tokenService: TokenService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _profileService: ProfileService,
        public snackBar: MatSnackBar) {

    }

    ngOnInit() {
        this._profileService.getProfile().subscribe(res => {
            this.loggedInUser = res;
            console.log("this is logged in user ", this.loggedInUser);
        })

    }


    /**
     * ngAfterViewInit
     */
    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        this.user_id = localStorage.user_id;


        // console.log(this.mediaOpen);

        //show flash message
        this.subscriptionFlash = this.flashService.flash$.subscribe(result => {
            console.log(result);
            this.snackBar.open(result['message'], result['subject'], {
                duration: 1000,
            }).afterDismissed().subscribe(() => {
                //any call back
            });
        });
        /** TODO: Low (Not sure but it detect the changes while calling subscribed services ) */
        this._changeDetectorRef.detectChanges();



    }


    /**
     * Destroy the glaxy :D
     * 
     */
    ngOnDestroy() {
        this.subscriptionFlash.unsubscribe();
    }

    /**
     * Get the f*** out of here...
     */
    logOut() {
        this._loginService.logOut();
    }
}