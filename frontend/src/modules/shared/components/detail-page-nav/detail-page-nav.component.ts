import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TdDialogService } from '@covalent/core';
// import { PageActions } from 'modules/app';

@Component({
    selector: 'detail-page-nav',
    templateUrl: 'detail-page-nav.component.html',
    styleUrls: ['detail-page-nav.component.css']
})
/**
 * @class DetailPageNavComponent
 */
export class DetailPageNavComponent {

    @Input() page: string;
    @Input() model: any;
    @Input() url: string;
    @Input() leadActionLink: boolean;

    @Output() deleteRecord = new EventEmitter<any>();

    // public pageActions = PageActions;

    constructor(
        private router: Router,
        private _dialogService: TdDialogService
    ) { }

    ngOnInit() {

    }

    delete(model) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.deleteRecord.emit(model);

            }
        });
    }

}