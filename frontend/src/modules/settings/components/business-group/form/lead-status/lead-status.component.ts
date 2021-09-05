import { Component, Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { StatusFlow } from 'modules/settings';
import { StatusFlowService } from 'modules/settings';
import { LeadStatusDialogComponent } from './lead-status-dialog/lead-status-dialog.component';

@Component({
    selector: 'lead-status',
    templateUrl: 'lead-status.component.html',
    styleUrls: ['lead-status.component.css']
})
export class LeadStatusComponent {

    private dialogRef: MatDialogRef<LeadStatusDialogComponent>;

    @Input() business_group_id: string;

    public leadStatuses: StatusFlow[];

    constructor(
        private _statusFlowService: StatusFlowService,
        private _dialogService: TdDialogService,
        public dialog: MatDialog
    ) {
    }

    /**
     * On Init
    */
    ngOnInit() {
        this._loadData();

    }

    private _loadData(): void {
        let queryString = {'filter': {'business_group_id':this.business_group_id,'type': 'Lead'}}; // will be used when needed
        this._statusFlowService.index_paged(queryString).subscribe(
            response => {
                this.leadStatuses = response['statuses'];
                console.log(this.leadStatuses);
            },
            error => console.log(error)
        )
    }
    /**
     * Dialoge will be open (Form of Status)
     */
    openDialog(id?: string) {
        this.dialogRef = this.dialog.open(LeadStatusDialogComponent, {
            width: '600px',
            disableClose: false,
            data: {
                business_group_id: this.business_group_id,
                _id: id,
                pageAction: id ? 'update' : 'create',
                type: "Lead"
            }
        });

        this.dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result == true) {
                this._loadData();
            }
            this.dialogRef = null;
        });
    }

    /**
     * delete record from the delete event click 
     * @param model 
     */
    deleteRecord(model: StatusFlow) {
        //delete process
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.deleteStatus(model);
            }
        });

    }
    /**
     * This is a private method will only be used when required
     * @param status 
     */
    private deleteStatus(status: StatusFlow) {
        this._statusFlowService.delete(status._id).subscribe((result) => {
            if (result) {
                this._loadData();
            }
        }, error => {
            // call back error
        })
    }

}