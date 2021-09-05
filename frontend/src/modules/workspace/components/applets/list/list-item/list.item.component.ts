import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { _ } from "lodash-node";
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { LayoutService, DialogueService } from 'modules/layout/';
import { List, ListItem, FormListDialogueComponent, WorkSpace, ListItemService } from "../../../../";
import { ErrorHandlerService,DeleteDialogComponent } from '../../../../../shared';

@Component({
  selector: 'applet-list-item',
  templateUrl: './list.item.component.html',
  styleUrls: ['./list.item.component.css', '../stylesheets/list-styles.css'],
  providers: [DialogueService, ErrorHandlerService]
})
export class ListItemComponent implements OnInit {

  constructor(private dialogueService: DialogueService,
    public dialog: MatDialog,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
    private _listItemService: ListItemService,
    private _errorService: ErrorHandlerService,
    public snackBar: MatSnackBar ) { }

  private dialogRefList: MatDialogRef<FormListDialogueComponent>;
  public displayItemSettings = false; //BOLEAN THAT TELLS TO SHOW SETTINGS OR NOT
  // public listItems: ListItem[]; //ARRAY OF ALL LIST ITEMS
  public totalRecords: number; //NUMBER OF TOTAL RECORDS
  public newItem: string = ""; //KEEPS VALUE OF NEW ITEM INPUT EMPTY
  public startDrag: number = -1;  //TO TRACK INDEX OF DRAGGED ITEM
  @Output() onDelete = new EventEmitter<string>();

  @Input() list: List; //LIST OF WHICH THIS IS LISTITEM OF
  @Input() listType: string = 'none'; //STYLE OF LIST (ROMAN,BULLETS ETC)
  @Input() ws;

  @Input() listItem:ListItem;


  public ngOnInit() {
this.listItem.is_editAble=false;

  }



  // /**
  // * Get All the List Items against List
  // */
  // public getItemsAgainstList() {
  //   let queryString = {};
  //   this._listItemService.index_paged(this.ws._id, queryString, this.list).subscribe(
  //     response => {
  //       // console.log(response);
  //       this.listItems = response['listItems'];
  //       this.totalRecords = response["totalCount"];
  //     },
  //     error => {
  //       this._errorService.handleError(error);
  //     }) // end of subscribe
  // }

/**
 * UPDATE CURRENT LIST ITEM
 */
  public getListItem()
  {
    this._listItemService.findByID(this.ws._id,this.listItem._id,this.list).subscribe(item=>
    {
      this.listItem=item;
    })

  }


  /**
   * MARKS LIST ITEM AS DONE
   * @param item 
   */
  doneItem() {
    //confiramation
    let data = <ListItem>{ 'done': (!this.listItem.done) }

    this._listItemService.update(this.ws._id, this.listItem._id, data, this.list).subscribe(resp => {
      console.log(resp);
      // this.getItemsAgainstList();
      this.getListItem();
    },
      error => {
        this._errorService.handleError(error);
      });
  }

  /**
  * UPDATES LIST ITEM
  */
  updateItem( list: List) {
    console.log("Checking value of new item", this.listItem.name);
    let model = <ListItem>{
      'name': this.listItem.name
    }
    this._listItemService.update(this.ws._id, this.listItem._id, model, list).subscribe(res => {
      console.log("Inside update Item1", res);
      this.getListItem();
    },
      error => {
        this._errorService.handleError(error);
      })
  }

  /**
   *STOPS FROM CALLING PARENT COMPONENTS METHODS
   */

  stopPropagation($event) {
    if ($event.stopPropagation) {
      // FOR IE 8+
      $event.stopPropagation();
    } else {
      // FOR IE < 8
      $event.returnValue = false;
    }
  }


  /**
   * TOGGLES BETWEEN EDITABLE STATE
   */

  toogleEditable() {
    this.listItem.is_editAble = !this.listItem.is_editAble;
  }

  /**
   * 
   * @param item 
  */
  public deleteItem() {

    const data = {
      type: "listItem",
      object: this.listItem
    }

    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      if (result) {
        this._listItemService.delete(this.ws._id, this.list._id, this.listItem).subscribe(res => {
          this.showSnackBar(this.listItem.name + " has been deleted");
          this.getListItem();
        },
          error => {
            this._errorService.handleError(error);
          });

      }
    })
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


  /**
 * SHOW SNACKBAR WITH PROVIDED MESSAGE
*/
  private showSnackBar(message: string): void {
    if (!message || message === '') {
      message = 'Something went wrong';
    }
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }

}
