import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ManageGroupSettingsService, WorkSpace } from '../../';
import { FlashService } from './../../../layout';
import { UserService, User } from '../../../settings'

@Component({
  selector: 'app-form-GroupSettings',
  templateUrl: './form-GroupSettings.component.html',
  styleUrls: ['./form-GroupSettings.component.css'],
  providers: [ManageGroupSettingsService]
})
export class FormGroupSettingsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FormGroupSettingsComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _manageGroupSettingsService: ManageGroupSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }



  public settingForm: FormGroup; //FORMGROUP FOR MANAGING GROUPSPACE SETTNGS
  public filteredData: any; //DATA FILTERED FROM USERLIST FOR AUTOCOMPLETE
  public userList: User[]; //LIST OF ALL THE USERS
  public ws: WorkSpace; //CURRENT WORKSPACE
  public userRoles: string[] //POSSILE ROLES OF USERS 

  ngOnInit() {
    this.generateSearchForm();
    this.ws = this.data.workSpace;
    this.getUsers();
    this.getRoles();
  }

  /**
   *FORM FOR SEARCHING WRT TO USER AND DATE 
   */
  generateSearchForm() {
    this.settingForm = this.fb.group({
      user: ['', Validators.required],
      role: ['', Validators.required]
    });

  }
  /**
* FILTERS USERS FOR AUTOCOMPLETE
*/
  filterUsers() {

    this.filteredData = this.settingForm.get('user').valueChanges
      .startWith(null)
      .map(val => this.filterResult(val));
  }

  /**
* USED BY filterUsers() TO FILTER USERS
* @param val VALUE THAT IS BEING ENTERED IN AUTOCOMPLETE
*/

  filterResult(val: any) {

    let type = typeof val;
    // console.log("type of", typeof val)
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
  * ADDS A USER TO CURRENT WORKSPACE
  */

  addUser(model1, isValid: boolean) {
    let model = {
      user: model1.user._id,
      role: model1.role
    }
    if (isValid) {
      this._manageGroupSettingsService.addUser(model, this.ws).subscribe(res => {
        console.log('this is my response', res);
        FlashService.instance.setFlashMessage(res.message, "");
        this.settingForm.reset();
        this.dialogRef.close(res);
        // this.getUsers();
        // this.reloadWorkSpace();
      })
    }

  }


  getRoles() {
    this._manageGroupSettingsService.getRoles().subscribe(roles => {
      this.userRoles = roles;
      console.log('this is roles', this.userRoles);

    })
  }


  /**
* FETCHES ALL USERS TO SHOW IN AUTOCOMPLETE
*/
  getUsers() {
    this._manageGroupSettingsService.getUsers(this.ws).subscribe(res => {
      this.userList = (<any>res).users;
      console.log("users list ", this.userList);
      this.filterUsers();
    },
      error => {
        FlashService.instance.setFlashMessage("", "Something went wrong");
      });
  }

  /**
 * 
 * @param assign DISPLAYS DIFFERENT VIEW VALUE FOR AUTOCOMPLETE
 */

  displayFn(assign: any): string {
    return assign ? assign.fullname : assign;
  }

}
