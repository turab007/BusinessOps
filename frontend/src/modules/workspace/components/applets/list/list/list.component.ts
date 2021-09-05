import { Component, ViewChild, OnInit, ViewContainerRef, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject} from 'rxjs/Subject';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { _ } from 'lodash-node';
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { DragulaService } from 'ng2-dragula';
import { LayoutService, DialogueService } from 'modules/layout/';
import { FlashService } from './../../../../../layout';
import { menuArr } from '../../../../menu';
import 'rxjs/add/operator/takeUntil';

import {
  AppletDialogueComponent, FormListDialogueComponent,
  WorkspaceService, ListService, ListItemService,
  WorkSpace, List, ListItem, CopyListDialogueComponent,
  ShareListDialogComponent,
} from '../../../../';

import { DeleteDialogComponent } from '../../../../../shared';

@Component({
  selector: 'applet-list-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css', '../stylesheets/list-styles.css'],
  providers: [DialogueService]
})
export class ListComponent implements OnInit, OnDestroy {


  constructor(private _menuService: LayoutService,
    private _dialogueService: DialogueService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private _workSpaceService: WorkspaceService,
    private _dialogService: TdDialogService,
    private _loadingService: TdLoadingService,
    private _viewContainerRef: ViewContainerRef,
    private _listService: ListService,
    private _dragulaService: DragulaService,
    private _listItemService: ListItemService) {
    // this._menuService.setMenu(menuArr);
     this.dragEndUsingDragula(_dragulaService);

  }
  //For edit and new dialogue of List
  public ws: WorkSpace; //CURRENT WORKSPACE
  public lists: List[]; //CONTAINS ALL LISTS
  public totalRecords: number; //TOTAL NUMBER OF RECORDS
  public startDrag: number = -1; //TO KEEP TRACK OF INDEX OF DRAGGED LIST
  public subscriptionDialogue: Subscription; // Dialogue service subscription
  private dialogRefList: MatDialogRef<FormListDialogueComponent>;
  private dialogShareList: MatDialogRef<ShareListDialogComponent>;
  private overlayStarSyntax: boolean = false; //for overlay loading tracking
  public newItem: string = ""; //KEEPS VALUE OF NEW LIST ITEM INPUT EMPTY
  private dialogRefWorkSpace: MatDialogRef<AppletDialogueComponent>;
  private destroy$ = new Subject();

  /**
   * initialization right call after 
  */
  public ngOnInit() {
    this.loadWorkSpace();
  }

  /**
   * SETS BREADCRUMBS
   */
  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/workspace/' + this.ws._id, title: 'Workspace' },
      { title: 'Lists' }
    ])
  }




  /**
   * 
   * TO SHARE A LIST VIA EMAIL
  */
  share(list: List) {
    const data = {
      list: list,
      ws: this.ws
    };
    this.createDialog(ShareListDialogComponent, data).afterClosed().subscribe((result) => {
      this.dialogShareList = null;
      //list sharing process
      if (result) {
        this._loadingService.register('overlayStarSyntax');
        this._listService.share(result.list._id, result.model, result.ws).subscribe(resp => {
          this._loadingService.resolve('overlayStarSyntax');
          this.showSnackBar("List has been shared successfully!");

        }, error => {
          this._loadingService.resolve('overlayStarSyntax');
          this.showSnackBar("Something goes wrong!");
        })
      }

    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * TO ARCHIVE A LIST
   */

  archive(list: List) {

    let data = <List>{ 'archived': !list.archived }
    this._loadingService.register('overlayStarSyntax');
    this._listService.update(list._id, data, this.ws).subscribe(res => {
      this._loadingService.resolve('overlayStarSyntax');
      this.getListsAgainstWorkSpace();
      console.log("I am inside archive ", list);
    },
      error => {
        this._loadingService.resolve('overlayStarSyntax');
        this.showSnackBar("Something went wrong!");
      }
    );

  }

  /**
   * CHANGE THE STYLE OF THE LIST
   */
  changeListStyle(list: List, style: string) {
    let data = <List>{ 'listStyle': style };
    this._listService.update(list._id, data, this.ws).subscribe(res => {
      this.getListsAgainstWorkSpace();
    })

  }
  /**
   * Change Order/Weight functionalty
   * CALLED WHEN WE START DRAGGING LIST
   */

  dragStart(i: number, $event) {
    // $event.preventDefault();

    console.log("I am inside dragStart ", i);
    $event.dataTransfer.effectAllowed = 'move';
    $event.dataTransfer.setData('text/plain', '');

    this.startDrag = i;
  }

  /**
   * CALLED WHEN LIST ENTERS IN A NEW POSITION      
   * */

  dragEnter(i: number, $event) {
    // $event.preventDefault();
    if (i != this.startDrag && this.startDrag != -1) {
      console.log("I am inside dragEnter ", i, this.startDrag);
      this.lists.splice(i, 0, this.lists.splice(this.startDrag, 1)[0]);
      this.startDrag = i;
    }

  }
  /**
   * CALLED WHEN DRAG ENDS
   * Update order
   * @param i 
   * @param  
  */
  dragEnd(i: number, $event) {
    // $event.preventDefault();

    console.log("Inside drag end list");
    this.startDrag = -1;
    let data = { 'lists': {} };
    _.forEach(this.lists, function (model, key) {
      data['lists'][model._id] = key;
    });

    this._listService.updateOrder(data, this.ws).subscribe(res => {
      // this.getListsAgainstWorkSpace();
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }


  /**
 * SAVES NEW LIST 
 */
  saveItem(newItem: string, list: List) {
    console.log("inside saveListItem function", newItem);
    //if item not empty
    if (newItem) {
      let model = <ListItem>{ 'name': newItem, weight: list.items.length }
      this._listItemService.create(this.ws._id, model, list).subscribe(resp => {
        this.getListsAgainstWorkSpace();
        this.newItem = "";

      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong")
        })
    }

  }

  /**
   *  Drag Using Draggula
  */
  private dragEndUsingDragula(_dragulaService) {
    let that = this;
    _dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      console.log(value.slice(1));
      console.log(value);
      //preparation of data element for dragging
      let data = { 'items': {} };
      console.log("=======================",data);
      const [bagName, element, newGroup, oldGroup] = value;
      let index = this.getElementIndex(element);
      // console.log("element",index,newGroup.dataset);

      //tgId: Task Group Id 
      let tgId: string = newGroup.dataset.id;

      //Find Current Task Group Object to verify invalid task Group from database
      that._listService.findByPk(tgId, this.ws._id).subscribe(taskGroup => {

        var taskComponents = document.querySelectorAll(`div.group_${tgId} > applet-list-item`);
        console.log("checking lodash", taskComponents);
        //preparing task group tasks new order
        _.forEach(taskComponents, function (taskObj, key) {
          data['items'][taskObj.dataset.id] = key;
        });


        // if same drag inside same group and Task Group _id  = newGroup.dataset.id
        if (oldGroup.dataset.id == newGroup.dataset.id) {
          that._listItemService.updateOrder(this.ws._id,data, taskGroup).subscribe(response => {

          }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
        }
        // drag on different group , first update the group and then call drag
        else {
          // Task _id = element.dataset.id and Task Group _id  = newGroup.dataset.id
          let model = <ListItem>{ task_group_id: newGroup.dataset.id }
          that._listItemService.update(this.ws._id,element.dataset.id, model, taskGroup).subscribe(response => {
            // this.taskGroups.find(element => {
            //   return element._id == taskGroup._id
            // }).tasks.find(tElement => {
            //   return tElement._id == element.dataset.id;
            // }).task_group_id = taskGroup._id; 

            this.getListsAgainstWorkSpace();


            that._listItemService.updateOrder(this.ws._id,data, taskGroup).subscribe(response => {

            }, error => {
              FlashService.instance.setFlashMessage("", "Something went wrong");
            });
          }, error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
        }
      }, error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      })

    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");
    });
  }

    /**
   * RETURNS INDEX OF ELEMENT IN PARENT
   * @param e1 ELEMENT WHOSE INDEX IS TO BE SEARCHED
   */
  private getElementIndex(e1: any) {
    return [].slice.call(e1.parentElement.children).indexOf(e1);
  }

  /**
   * CALLED WHEN USER WANTS TO COPY LIST TO ANOTHER WORKSPACE
   */

  copyList(list: List) {
    const data = {
      list: list,
    };
    this.createDialog(CopyListDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
      this.getListsAgainstWorkSpace();
      this.dialogRefList = null;
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });

  }


  /**
   * Above method will all workspace contents
  */
  private loadWorkSpace() {
    this.route.params.subscribe(
      params => {
        let wsId = params['ws_id'];

        this.setRecord(wsId);
      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
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
        // Get all lists now 
        this.getListsAgainstWorkSpace();
      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
        // console.log("this is my testing error");
        this._menuService.setMenu(menuArr);

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
      FlashService.instance.setFlashMessage("", "Something went wrong");

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
    });

    //set menu 
    this._menuService.setMenu(menu, ":id", wsId);


  }

  /**
  * Subscribe the applet dialogue
  */
  private subScribeAppletDialogue() {

    let emitter: EventEmitter<{}> = DialogueService.instance.getDialogEmitter();
    if (emitter) {
      // console.log('lists home subscribing to dialog service');

      this.subscriptionDialogue = emitter.subscribe(result => {
        const data = {
          workSpace: this.ws
        }

        this.createDialog(AppletDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
          this.reloadWorkSpace();
          this.dialogRefWorkSpace = null;
        },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          });
      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        });
    }

  }

  /**
   * Get All the List against workSpace
  */
  getListsAgainstWorkSpace() {
    let queryString = {};
    this._listService.index_paged(queryString, this.ws).subscribe(
      response => {
        this.lists = response['lists'];
        console.log("these are lists", this.lists);
        this.totalRecords = response["totalCount"];
        // console.log(this.lists);
        // this._loadingService.resolve('overlayStarSyntax');
      },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      }
    ) // end of subscribe
  }

  /**
   * Add New List opens with pop up
   * @param type 
  */
  public addList() {
    const data = {
      action: 'create',
      workSpace: this.ws,
    };
    this.createDialog(FormListDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
      if (result == true) {
        this.getListsAgainstWorkSpace();
      }
      this.dialogRefList = null;
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }
  /**
   * Update List
   * @param list 
  */
  public updateList(list: List) {
    const data = {
      action: 'update',
      workSpace: this.ws,
      list: list
    };
    this.createDialog(FormListDialogueComponent, data).afterClosed().subscribe((result: boolean) => {
      if (result == true) {
        this.getListsAgainstWorkSpace();
      }
      this.dialogRefList = null;
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  // /**
  //  * Toggle display button of list
  //  * @param list 
  //  */
  // toggleListSettings(list: List) {
  //   list.displaySettings = !list.displaySettings;

  // }

  /**
   * Delete lsit from database
   * @param list 
   */
  deleteList(list: List) {
    const data = {
      type: 'list',
      object: list
    }

    this.createDialog(DeleteDialogComponent, data).afterClosed().subscribe(result => {
      // console.log('resulrt ',result);
      if (result) {
        this._listService.delete(list._id, this.ws)
          .subscribe(res => {
            this.showSnackBar(list.name + " has been deleted");
            this.getListsAgainstWorkSpace();
          },
          error => {
            FlashService.instance.setFlashMessage("", "Something went wrong");
          })
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

  ngOnDestroy(): void {
    // this._dialogueService.setDialogEmitterAvailable();
    if (this.subscriptionDialogue) {
      this.subscriptionDialogue.unsubscribe();
      this.destroy$.next();
    }
  }

}
