import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LayoutService } from 'modules/layout/services/layout.service';
import { menuArr } from 'modules/settings/menu'

import { Release } from 'modules/settings/';
import { ReleaseService } from 'modules/settings/';

@Component({
    selector: 'release-page',
    templateUrl: 'release-index.component.html',
    styleUrls: ['release-index.component.css']
})
export class ReleaseIndexComponent implements OnInit {

    public releases: Release[];

    constructor(
        private _releaseService: ReleaseService,
        private router: Router,
        private menuService: LayoutService) {
        //ToDO:low take this to central place
        menuArr['sub_module'] = 'Release'
        this.menuService.setMenu(menuArr);
    }

    ngOnInit(): void {
        this.menuService.setBreadCrumb([
            { url: '/dashboard', title: 'Dashboard' },
            { title: 'Releases' },
        ])

        this._getReleases();
    }

    private _getReleases() {

        this._releaseService.index().subscribe(
            Response => {
                this.releases = Response;
                console.log(this.releases);
            },
            error => console.log(error)
        ) // end of subscribe
    }

}