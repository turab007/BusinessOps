import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService, Employee } from '../../';

@Component({
  selector: 'app-employee-github',
  templateUrl: './employee-github.component.html',
  styleUrls: ['./employee-github.component.css']
})
export class EmployeeGithubComponent implements OnInit {

  constructor(
    private _employeeService: EmployeeService
  ) { }

  @Input() employee: Employee
  public gitHubRepos; //LIST OF GITHUB REPOS OF AUTHENTICATED USER
  public githubBranches;
  public commits;
  public showRepos = true;
  public showBranches = false;
  public currentRepo; //STORES CURRENT REPOSITORY
  public showCommits = false //boolean that shows if repo detail elements should be shown
  public loading = false;

  ngOnInit() {
    console.log("this is employee in github", this.employee);
    if (this.employee.github_token) {

      console.log("my employee", this.employee);
      this.loading=true;
      this._employeeService.getGitHubRepos(this.employee._id).subscribe(repos => {

        this.loading=false;
        this.gitHubRepos = (<any>repos).repositories;
        console.log('this is github repos', this.gitHubRepos)
      })
    }
  }

  /**
   * REDIRECTS USER TO GITHUB AUTHENCTATION PAGE IF NOT AUTHENTICATED
   */
  // redirectGitHub() {
  //   window.location.href = "https://github.com/login/oauth/authorize?scope=user:email&client_id=461e2b6455eaaa0ff0a1";
  // }

  getRepoCommits(branch) {
    this.showBranches = false;
    this.loading=true;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    console.log('date', oneWeekAgo);
    console.log("repo details ", this.currentRepo);
    this._employeeService.getGithubRepoCommits(this.employee._id, this.currentRepo.owner.login, branch.name, this.currentRepo.name, "ddd", "fdfd").subscribe(response => {
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
    this._employeeService.getGithubRepoBranches(this.employee._id, repo.owner.login, repo.name).subscribe(branches => {
      this.githubBranches = (<any>branches).branches;
      console.log("returned branches", this.githubBranches);
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
