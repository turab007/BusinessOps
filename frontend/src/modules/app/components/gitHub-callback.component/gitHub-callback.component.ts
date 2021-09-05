import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../settings'

@Component({
  selector: 'app-callback-component',
  templateUrl: './gitHub-callback.component.html',
  styleUrls: ['./gitHub-callback.component.css'],
  providers:[UserService]
})
export class GitHubCallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  public loading=false;
  ngOnInit() {

    this.loading=true;
    // console.log("this is activated route", this.route);
    let url = this.router.url.split('=');
    console.log("this is router", url[1]);
    let authCode={
      code: url[1]
    }
    this.userService.authenticateGitHub(authCode).subscribe(res=>
    {
      console.log("this is authentication response",res);
      this.loading=false;
      this.router.navigate(["/dashboard"]);
    })
    // this.callBackService.getAccessToken().subscribe(res => {
    //   console.log("this is callback resposnse", res);
    // })
  }

}
