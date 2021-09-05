import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { List, WorkSpace, ListService } from './../../../../';
import { ProfileService } from '../../../../../settings/'
// import { ErrorHandlerService } from '../../../../../shared'
import { FlashService } from './../../../../../layout';
@Component({
  selector: 'app-copyListDialogue',
  templateUrl: './copyListDialogue.component.html',
  styleUrls: ['./copyListDialogue.component.css','../stylesheets/list-styles.css'],
  providers: [ProfileService,]
})
export class CopyListDialogueComponent implements OnInit {

  public workSpaces: WorkSpace[]; //LIST OF ALL WORKSPACES
  public list: List; //CURRENT LIST
  public copyForm: FormGroup; //FORMGROUP OF COPYLISTDIALOGUE
  public actions: string[] = ['Copy', 'Move']; //AVAILABLE ACTIONS TO BE PEROFRMED


  constructor(
    public _profileService: ProfileService,
    private _listService: ListService,
    private dialogRef: MatDialogRef<CopyListDialogueComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.list = this.data.list;
    this.generateFormContorls();
    //load workspaces
    this._profileService.getWorkSpaces().subscribe(res => {
      this.workSpaces = res;
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
   * GENERATES FORM ELEMENTS
  */
  public generateFormContorls() {
    this.copyForm = this.fb.group({
      action: ['', Validators.required],
      groupSpace: ['Public', Validators.required]
    });
  }

  /**
   * Action will be call here 
  */
  save() {
    let service;
    console.log('I am inside save function and i have ', this.copyForm.get('action').value, this.copyForm.get('groupSpace').value);
    let list = <List>{
      name: this.list.name, 
      description: this.list.description,
      weight: this.list.weight, 
      visibility: this.list.visibility
    };

    switch (this.copyForm.get('action').value) {

      case 'Copy': {
        service = this._listService.copy(this.list._id, list, this.copyForm.get('groupSpace').value)
        break;
      }
      case 'Move': {
        service = this._listService.move(this.list._id, list, this.copyForm.get('groupSpace').value);
        break;
      }
      case 'Link': {
        //PCM : High (In progress); 
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
    service.subscribe(res => {
      this.snackBar.open(`has been ${this.copyForm.get('action').value} successfully`, "List", {
        duration: 1000,
      }).afterDismissed().subscribe(() => {
        //any call back
        this.close();
      },
        error => {
          FlashService.instance.setFlashMessage("", "Something went wrong");
        });

    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      })

  }

  /**
   * CLOSES THIS DIALOGUE 
  */
  close() {
    this.dialogRef.close()
  }


}
