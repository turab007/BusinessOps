import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService, Employee } from '../../';

@Component({
  selector: 'app-employee-gitlab',
  templateUrl: './employee-gitlab.component.html',
  styleUrls: ['./employee-gitlab.component.css']
})
export class EmployeeGitlabComponent implements OnInit {

  constructor(
    private _employeeService: EmployeeService
  ) { }

  @Input() employee: Employee
  public gitLabRepos; //List of all repositories of authenticated user
  public commits; //list of all commits of selected repository
  public gitlabBranches; //LIST OF ALL BRANCES OF SELECTED REPOSITORY
  public showCommits = false //boolean that shows if repo detail elements should be shown
  public showRepos = true;
  public showBranches = false;
  public currentRepo; //STORES CURRENT REPOSITORY
  public loading=false;

  ngOnInit() {
    if (this.employee.gitlab_token) {

      this.loading=true;
      this._employeeService.getGitLabRepos(this.employee._id).subscribe(repos => {
        this.loading=false;
        this.gitLabRepos = (<any>repos).repositories;
        console.log("this is gitlab repos", this.gitLabRepos);
      })
    }
  }

  /**
   * REDIRECTS USER TO GITLAB AUTHENTICATION PAGE IF NOT AUTHENTICATED
   */

  // redirectGitLab() {
  //   window.location.href = "https://gitlab.vteamslabs.com/oauth/authorize?client_id=012d22ca117b19fd214d1e9791f4b29f5d116752c2645b258186925fb0619ca0&redirect_uri=http://dev-gc.vteamslabs.com/gitlabcallback&response_type=code";
  // }

  getRepoCommits(branch) {
    this.showBranches = false;
    this.loading=true;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    console.log('date', oneWeekAgo);
    console.log("repo details ", this.currentRepo);
    this._employeeService.getGitlabRepoCommits(this.employee._id, this.currentRepo.id, branch.name, "ddd", "fdfd").subscribe(response => {
      this.commits = (<any>response).commits;
      this.loading=false;
      this.showCommits = true;
      console.log("i got this response", this.commits);
    })

  }

  /**
   * GETS BRANCHES OF SELECTED REPOSITORY
   */
  getRepoBranches(repo) {
    this.currentRepo = repo;
    this.showRepos = false;
    this.loading=true;
    console.log("this is repo", repo);
    this._employeeService.getGitlabRepoBranches(this.employee._id, repo.id).subscribe(branches => {
      this.gitlabBranches = (<any>branches).branches;
      console.log("returned branches", this.gitlabBranches);
      this.loading=false;
      this.showBranches = true;

    });

  }

  navigateToBranches() {
    this.showCommits = false;
    this.showBranches = true;
  }

  navigateToRepos() {
    this.showBranches = false;
    this.showRepos = true;
  }


}
