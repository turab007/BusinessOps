import { Component, OnInit, Input, Output, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';
import { Router } from '@angular/router';

import {
    TdDataTableService, TdDataTableSortingOrder, ITdDataTableSelectEvent,
    ITdDataTableSortChangeEvent, ITdDataTableColumn, IPageChangeEvent, TdDialogService
} from '@covalent/core';

@Component({
    selector: 'datatable',
    templateUrl: 'datatable.component.html',
    styleUrls: ['datatable.component.css'],
    animations: [
        trigger('toggleState', [
            state('inactive', style({
                transform: 'translateX(100%)',
                display: 'none',
            })),
            state('active', style({
                transform: 'translateX(0)'
            })),
            transition('inactive => active', animate('150ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ]
})
/**
 * This component class is responsible for rendering covelent datatables
 * Version: 1.0.0
 * how to use?
 *  <datatable *ngIf="data && data.length" 
            [dataList]="data" 
            [columns]="dtColumns" 
            [actionButtons]="actionButtons" 
            (deleteRecord)="deleteRecord($event)"
            [sortBy]="'name'"
            [totalRecords]="totalRecords" 
            (nextPage)="nextPage($event)"
 * ></datatable>
 * 
 * @class DatatableComponent
 */
export class DatatableComponent {

    @Input() columns: ITdDataTableColumn[];
    @Input() dataList: any[];
    @Input() actionButtons: any[];

    @Input() totalRecords: number;
    @Input() sortBy: string;

    @Output() deleteRecord = new EventEmitter<any>();
    @Output() nextPage = new EventEmitter<any>();
    @Output() filterRecords = new EventEmitter<any>();

    filteredData: any[];
    filteredTotal: number;

    searchTerm: string = '';
    fromRow: number = 1;
    currentPage: number = 1;
    pageSize: number = 10;
    pageSizes = [10, 15, 20];

    public filterObj: Object = {};

    public columnSortOrders = {}// 'name': 'ASC', 'module_id': 'ASC', 'description': 'ASC' 
    public activeSortedColumn = {}

    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

    filterState: string = "inactive";

    toggleFilter() {
        this.filterState = (this.filterState == "inactive" ? "active" : "inactive");
    }

    constructor(
        private _dataTableService: TdDataTableService,
        private router: Router,
        private _dialogService: TdDialogService) { }

    ngOnInit() {
        this.columnSortOrders[this.sortBy] = 'DESC';
    }

    ngOnChanges() {
        this._loadData();
    }

    private _loadData() {

        this.filteredTotal = this.totalRecords; //this.dataList.length;
        this.filter();
    }

    filter(): void {

        let newData = this.dataList;

        newData = this._dataTableService.filterData(newData, this.searchTerm, true);
        this.filteredTotal = this.totalRecords; //newData.length;
        newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);

        // Un comment following for local pagination
        // newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);

        this.filteredData = newData;
    }

    __deleteRecord(model) {
        this._dialogService.openConfirm({
            message: 'Are you sure, you want to delete?',
            disableClose: false,
            title: 'Confirm',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.deleteRecord.emit({ model: model, pageSize: this.pageSize, currentPage: this.currentPage });

            }
        });
    }
    /**
     * activate the column sorting and rest of the columns shoulbe in activate
     * @param column 
     *   {name: "name", label: "Name", tooltip: "Name", sortable: true, width: "30%"}
     */
    activateColumnSorting(column) {
        //initiate the columnSorting activate to make in-acitive others
        this.activeSortedColumn = {};
        this.activeSortedColumn[column.name] = true;
    }

    //TODO:low: following methods are not functional..
    sort(sortEvent: ITdDataTableSortChangeEvent, column: string): void {



        // TODO : sorting is working bu t arrow keys are not chaing on headers
        sortEvent.name = column;
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;
        this.filter();
        if (sortEvent.order.toString() == 'ASC') {
            this.columnSortOrders[column] = 'DESC';
        }
        else {
            this.columnSortOrders[column] = 'ASC';
        }
    }

    // selectEvent(selectEvent: ITdDataTableSelectEvent): void {
    //     console.log(selectEvent);
    // }

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.filter();
    }

    /**
     * Pagination
     * 
     * @param pagingEvent 
     */
    page(pagingEvent: IPageChangeEvent): void {


        this.fromRow = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;

        // Comment following for local pagination
        // Load next page.
        this.nextPage.emit({ pageSize: this.pageSize, currentPage: this.currentPage });

        // Un comment following for local pagination
        // this.filter();
    }

    /**
     * Filter records.
     * 
     * @param event Input
     * @param key string
     */
    __filterRecords(event, key) {

        //TODO:high: navigatio to 5th, 6th or any page and then search/filter. Default page should be the first page after filter.
        this.filterObj[key] = event.target.value;

        this.filterRecords.emit(this.filterObj);


    }
}