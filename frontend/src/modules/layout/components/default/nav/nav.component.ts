import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'page-nav',
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.css']
})
export class NavComponent {


    @Output() closeClicked: EventEmitter<any> = new EventEmitter<any>();

    //TODO:low: move to proper place 
    /**
     * 
     * {
        title: 'Dashboard',
        route: '/dashboard',
        icon: 'dashboard',
        ifPermitted: "",

        },
        {
            title: 'Business Opps',
            route: '/business-opps',
            icon: 'business',
            ifPermitted: "''",
        }, {
            title: 'Settings',
            route: '/settings/users',
            icon: 'settings',
            ifPermitted: "user.index",
        },
     */
    routes: Object[] = [
    ];

    constructor() {
        // console.log(parent);
    }

    closeLayout(): void {
        this.closeClicked.emit();
    }

}