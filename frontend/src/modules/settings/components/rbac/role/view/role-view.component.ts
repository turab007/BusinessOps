import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
    selector: 'role-view',
    templateUrl: 'role-view.component.html',
    styleUrls: ['role-view.component.css']
})
export class RoleViewComponent {


    constructor(private router: Router) { }

}