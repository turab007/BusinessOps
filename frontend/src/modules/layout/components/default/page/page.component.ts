import { Component, Renderer, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';


import { ProfileService, User } from '../../../../settings';
import { LoginService } from 'modules/login/services/login.service';
import { LayoutService, FlashService, TokenService, SideNavService, DialogueService } from '../../../';


@Component({
    selector: 'app-main-page',
    templateUrl: 'page.component.html',
    styleUrls: ['page.component.css', '../stylesheets/layout-styles.css'],
    providers: [ProfileService]

})
export class PageComponent implements OnDestroy, OnInit {


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

        private layoutService: LayoutService, private flashService: FlashService,
        private tokenService: TokenService,
        public media: TdMediaService,
        private _changeDetectorRef: ChangeDetectorRef,
        public snackBar: MatSnackBar,
        private _loginService: LoginService,
        public dialog: MatDialog,
        private _profileService: ProfileService) {

        this.subscriptionMenu = this.layoutService.menu$.subscribe(menuArr => {
            // console.log("----Menu-----");

            this.menuArr = menuArr;
            // console.log(this.menuArr);
        });

        this.subscriptionBC = this.layoutService.breadCrumb$.subscribe(result => {
            this.breadCrumbs = result;
            // console.log('these are breadcrumbs',this.breadCrumbs);
            /** TODO: Low (Not sure but it detect the changes while calling subscribed services ) */
            this._changeDetectorRef.detectChanges();
        });

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

        this.media.broadcast();


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
     * Subscribe service
     */
    public openDialogue() {

        DialogueService.instance.setDialogue();
    }


    /**
     * Destroy the glaxy :D
     * 
     */
    ngOnDestroy() {
        this.subscriptionMenu.unsubscribe();
        this.subscriptionFlash.unsubscribe();
        this.subscriptionBC.unsubscribe();
    }

    /**
     * Get the f*** out of here...
     */
    logOut() {
        this._loginService.logOut();
    }
}