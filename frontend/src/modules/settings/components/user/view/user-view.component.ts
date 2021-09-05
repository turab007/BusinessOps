import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TdDataTableService, ITdDataTableColumn } from '@covalent/core';



import { User } from './../../../view-models/user';

import { UserService } from './../../../services/user.service';

@Component({
  selector: 'user-view-page',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.css']
})

export class UserViewComponent implements OnInit {
  constructor(private _userService: UserService, private route: ActivatedRoute) { }
  public user: User

  ngOnInit(): void {
    this.showDetail();
  
  }
  /**
   * 
   */
  public showDetail():void{
    this.route.params.subscribe(
      params => {
        let id = params['id'];

        console.log(params['id']);

        this._userService.get(id).
          subscribe(
            user => {
              this.user = user
            },
            error => console.log(error)
          ) // end of subscribe

      });
  }
}