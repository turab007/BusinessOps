import { Component, ViewChild, OnInit, EventEmitter, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { _ } from 'lodash-node';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { LayoutService, DialogueService } from 'modules/layout/';
import { menuArr } from 'modules/workspace/menu';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import {
  AppletDialogueComponent, WorkSpace, WorkspaceService, FormAddEodComponent, EodService,
  EodReport, ViewEodReportComponent
} from '../../../../'
import { UserService, User } from '../../../../../settings'
import { ITdDataTableColumn, IPageChangeEvent, TdDialogService } from '@covalent/core';
import { DatePipe } from '@angular/common';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent } from '@covalent/core';
import { FlashService } from './../../../../../layout';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { DeleteDialogComponent } from '../../../../../shared';

@Component({
  selector: 'app-eod-reports-home',
  templateUrl: './eod-reports-home.component.html',
  styleUrls: ['./eod-reports-home.component.css'],
  providers: [DialogueService, EodService, DatePipe, UserService,]
})
export class EodReportsHomeComponent implements OnInit, OnDestroy {


  constructor(
    private _menuService: LayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private _workSpaceService: WorkspaceService,
    private _dialogueService: DialogueService,
    public dialog: MatDialog,
    private _eodService: EodService,
    private datePipe: DatePipe,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar,
    private _dataTableService: TdDataTableService,
    private fb: FormBuilder,
    private _userService: UserService) {

    this._menuService.setMenu(menuArr);

  }

  public ws: WorkSpace;
  public subscriptionDialogue: Subscription;
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;
  public sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending; //SORT ORDER OF DATATABLE
  public eodReports: EodReport[]; //ALL EOD REPORTS
  public queryStrings: Object = {}; //STORES QUERYSTRING TO SEND IN GET REQUEST
  public totalRecords: number;    //STORES TOTAL NUMBER OF RECORDS 
  public currentPage: number = 1; //STORES CURRENT PAGE OF DATATABLE
  public pageSize: number = 10; //TELLS PAGE SIZE OF DATATABLE
  public sortBy: string = 'created_at'; //DECIDES BY WHICH COLUMN DATATABLE SHOULD BE SORTED BY
  public selectedEod; //STORES THE EOD THAT IS SELECTED TO DO EDIT,VIEW OR DELETE 
  public filteredData: any; //DATA FILTERED FROM USERLIST FOR AUTOCOMPLETE
  public searchForm: FormGroup; //FORMGROUP USED FOR SEARCHING EODREPORTS
  public userList: User[]; //LIST OF ALL THE USERS


  //Datatable dependency
  // dtColumns: any[] = [
  //   { name: 'date', label: 'Date', tooltip: 'Date', sortable: true, format: v => v ? this.datePipe.transform(v, 'longDate') : '' },
  //   { name: 'created_by', label: 'Reported by', tooltip: 'Reported by', sortable: true, format: v => v ? v.name : "" },
  //   { name: 'created_at', label: 'Created At', tooltip: 'Created At', sortable: true, format: v => v ? this.datePipe.transform(v, 'medium') : '' },
  //   { name: 'updated_at', label: 'Last Updated At', tooltip: 'Last Updated At', sortable: true, format: v => v ? this.datePipe.transform(v, 'medium') : '' },
  //   { name: 'action', label: 'ACTION' },
  // ];


  public ngOnInit() {
    this.loadWorkSpace();
    this.queryStrings['page'] = {
      pageSize: 10,
      currentPage: 1
    }
    this.generateSearchForm();
  }


  /**
   * FETCHES ALL USERS TO SHOW IN AUTOCOMPLETE
   */
  getUsers() {
    this._userService.getUsers().subscribe(res => {
      this.userList = (<any>res).users;
      // console.log("users list ", this.userList);
      this.filterUsers();

      // this.filteredData=this.userList;
      // this.filteredTotal=this.userList.length;
    },
      error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
      });
  }


  /**
   *FORM FOR SEARCHING WRT TO USER AND DATE 
   */
  generateSearchForm() {
    this.searchForm = this.fb.group({
      date: [''],
      name: ['']
    });

  }

  /**
   * GETTER FUNCTION OF EOD REPORTS
   */
  getEodReports() {

    this._eodService.index_paged(this.queryStrings, this.ws._id).subscribe(result => {
      this.eodReports = result.eodReports;
      this.totalRecords = result.totalCount;

    },
      error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
      })
  }

  /**
   * 
   * @param assign DISPLAYS DIFFERENT VIEW VALUE FOR AUTOCOMPLETE
   */

  displayFn(assign: any): string {
    return assign ? assign.fullname : assign;
  }

  // /**
  //  * 
  //  * @param pageInfo FUNCTIONS TO GET EOD REPORTS OF NEXT PAGE
  //  */

  // nextPage(pageInfo) {
  //   this.queryStrings['page'] = pageInfo;
  //   console.log("query string", this.queryStrings);
  //   this.getEodReports();
  // }
  /**
   * IMPLEMENTS SEARCHING OF EOD REPORTS
   * @param model VALUES OF SEARCHFORM
   * @param isValid IF FORM IS VALID
   */
  search(model, isValid: boolean) {
    let date: Date;
    console.log("Searching", model);
    if (model.name) {
      this.queryStrings['name'] = model.name;
    }
    if (model.date) {
      date = new Date(model.date);
      this.queryStrings['date'] = date.toISOString();
    }

    console.log('query string', this.queryStrings);
    this._eodService.search(this.queryStrings, this.ws._id).subscribe(eod => {
      this.eodReports = eod.eodReports;
      this.totalRecords = eod.totalCount;
      console.log("All reports", this.eodReports);
    },
      error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
      })
  }

  /**
   * RESET SEARCH FORM AND DISPLAYS ALL DATA
   */
  resetForm() {
    this.searchForm.reset();
    this.queryStrings['name'] = null;
    this.queryStrings['date'] = null;
    this.getEodReports();
  }


  /**
   * PEFORMS ACTIONS OF EDIT,DELETE OR VIEW ON SELECTED EOD REPORT
   * @param type TYPE OF ACTION TO BE PERFORMED
   */
  eodActions(type) {
    console.log("inside eodActions", this.selectedEod);

    if (type == 'edit') {
      this.createDialog(FormAddEodComponent, this.selectedEod)
    }
    else if (type == 'delete') {
      this.deleteEod();

    }

    else if (type == 'view') {
      // this.viewEod();
    }

  }

  /**
   * OPENS DELETE DIALOGUE FOR EOD REPORT
   */
  deleteEod() {
    const data = {
      type: 'EOD',
      object: { name: 'Eod report for ' + this.datePipe.transform(this.selectedEod.date) }
    }

    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        console.log("i want to be deleted", this.selectedEod);
        this._eodService.delete(this.selectedEod._id, this.selectedEod.work_space).subscribe(res => {
          console.log('Deleted', res);
          this.showSnackBar('Eod report has been deleted ');
        },
          error => {
            FlashService.instance.setFlashMessage("", "something went wrong");
          });
      }
    })
  }



  /**
   * DISPLAYS SNACKBAR
   * @param message STRING TO BE DISPLAYED
   */

  private showSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 1000,
    });
  }

  // /**
  //  *  IMPLEMENTS PAGINATION IN COVALENT DATATABLE
  //  * @param pagingEvent
  //  */
// 
  // page(pagingEvent): void {
  //   pagingEvent.currentPage = pagingEvent.page
  //   this.nextPage(pagingEvent);
  // }

  // /**
  //  * TO SORT DATA WRT TO ANY COLUMN
  //  * @param sortEvent 
  //  */
  // sort(sortEvent: ITdDataTableSortChangeEvent): void {
  //   this.sortBy = sortEvent.name;
  //   this.sortOrder = sortEvent.order;
  //   this._dataTableService.sortData(this.eodReports, this.sortBy, this.sortOrder);

  // }

  /**
   * FILTERS USERS FOR AUTOCOMPLETE
   */
  filterUsers() {

    // console.log("sss", this.searchForm.get('name'));
    this.filteredData = this.searchForm.get('name').valueChanges
      .startWith(null)
      .map(val => this.filterResult(val));
  }
  /**
   * USED BY filterUsers() TO FILTER USERS
   * @param val VALUE THAT IS BEING ENTERED IN AUTOCOMPLETE
   */

  filterResult(val: any) {
    let type = typeof val;
    if (type == 'string') {

      console.log('this is value', val);
      let abc = this.userList.filter(s =>
        s.fullname.toLowerCase().indexOf(val.toLowerCase()) === 0);

      console.log("this is abc", abc);
      return abc;
    }
    else if (type != null) {
      return this.userList;
    }

  }

  /**
   * 
   * @param model SAVES VALUE OF SELECTED ROW TO BE USED BY eodActions()
   */
  saveSelectedEod(model): void {
    this.selectedEod = model.row;
  }




  /**
   *FUNCION TO ADD AN EOD REPORT 
   */

  addEod() {
    let model = {
      work_space: this.ws._id
    }

    this.createDialog(FormAddEodComponent, model).afterClosed().subscribe(res => {
      this.getEodReports();
    },
      error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
      });

  }

  /**
   * SETS BREADCRUMBS
   */

  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { title: 'EOD Reports' }
    ])
  }


  /**
   * LOADS WORKSPACE
   */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        this.setRecord(wsId);
      },
      error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
      });
  }


  /**
   * Set WorkSpace Record
  */
  setRecord(id: string): void {

    this._workSpaceService.findByID(id).
      subscribe(
      ws => {
        this.ws = ws;
        this.subScribeAppletDialogue();

        this.setMenu(ws._id);
        this.setBreadCrumbs();
        this.getEodReports();
        this.getUsers();

      },
      error => {
        FlashService.instance.setFlashMessage("", "something went wrong");
        // console.log('this is error ', error);

      })
  }
  /**
  * Reload work space need on menu close
  */
  private reloadWorkSpace() {
    //get workspace from database
    this._workSpaceService.findByID(this.ws._id).subscribe((ws) => {
      this.ws = ws;
      this.setMenu(this.ws._id);

    }, error => {
      // call back error
    });
  }


  /**
   * Set Menu from workSpace
   * @param wsId 
   */
  private setMenu(wsId: string) {
    menuArr['sub_module'] = this.ws.name;
    let menu = menuArr;
    let applets = _.map(this.ws['applets'], "name");

    menu.applet_links = _.filter(menu.all_applets, (link) => {
      if (_.includes(applets, link.applet)) {
        return link;
      }
    })

    //set menu 
    this._menuService.setMenu(menu, ":id", wsId);

  }

  /**
  * Subscribe the applet dialogue
  */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('EOD reports subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(result => {
        const data = {
          workSpace: this.ws
        }

        // console.log('this is subscription ',this.subscriptionDialogue);

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        },
          error => {
            FlashService.instance.setFlashMessage("", "something went wrong");
          });
      },
        error => {
          FlashService.instance.setFlashMessage("", "something went wrong");
        });
    }

  }
  /**
   * Open any dialog
   * @param component Dialog Component to open
   * @param data Optional data to pass along
  */
  private createDialog(component, data?: any, width: string = '700px', disableClose: boolean = false) {
    const dialogRef = this.dialog.open(component, { panelClass: 'full-width-dialog' });
    const instance: any = dialogRef.componentInstance;
    instance.width = width;
    instance.disableClose = disableClose;
    instance.data = data;
    return dialogRef;
  }

  ngOnDestroy(): void {
    // this.dialogueService.setDialogEmitterAvailable();
    if (this.subscriptionDialogue) {
      // console.log(this.subscriptionDialogue);
      this.subscriptionDialogue.unsubscribe();
    }
  }
}
