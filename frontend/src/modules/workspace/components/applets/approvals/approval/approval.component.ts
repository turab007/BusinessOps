import { Component, OnInit, Input } from '@angular/core';
import { Approval } from '../../../../'
import { UserService, User } from '../../../../../settings'
import { FlashService } from './../../../../../layout';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css','../stylesheets/approvals-styles.css'],
  providers: [UserService]
})
export class ApprovalComponent implements OnInit {

  constructor(private _userService: UserService, ) { }

  currentUser: User; //CURRENT USER
  @Input() approvals: Approval[]; //LIST OF ALL APPROVALS
  @Input() status: string; //STATUS OF APPROVAL
  @Input() ws: string; //WORKSPACE ID


  ngOnInit() {
    console.log("approvals ",this.approvals);
    // console.log('all approvals',this.approvals);
    this._userService.getLoggedInUser().subscribe(res => {
      this.currentUser = res;

      // console.log('this is approvals',this.approvals);
    }, error => {
      FlashService.instance.setFlashMessage("", "Something went wrong");

    });
  }


}
