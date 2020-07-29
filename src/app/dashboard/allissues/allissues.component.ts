import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IssueService } from 'src/app/issue.service';

@Component({
  selector: 'app-allissues',
  templateUrl: './allissues.component.html',
  styleUrls: ['./allissues.component.css']
})
export class AllissuesComponent implements OnInit {
 

  public issues: any;
  public typeOfIssues: string;
  public userDetail;
  public myId;
  public myAuth; 
  public caption: string;
  public pageValue = 0;
  public isTitleSorted = false;
  public isStatusSorted = false;
  public isReporterSorted = false; 
  public isDateSorted = false;
  public isPaginated=false;


  constructor(private issueService: IssueService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userDetail = this.userService.getUserDetailsFromLocalStorage();
    this.myId = this.userDetail.userId;
    this.myAuth = this.userDetail.authToken;
    
  }
  
    
  
  /*getting all issues
  */
  public getAllIssues() {
    if (this.myAuth) {
      this.issueService.getAllIssues(this.myAuth, (this.pageValue * 6)).subscribe(
        (apiresponse) => {
          if (apiresponse['status'] === 200) {
            this.issues = apiresponse['data'];
          }
          else {
            this.pageValue--;
            this.toastr.warning(apiresponse['message']);
          }
        },
        (error) => {
          setTimeout(() => {
            this.router.navigate(['/server/error'])
          }, 2000);
        }
      )
    }
  }//end of getAllIssues
  public sortOnTitle() {

    if (!this.isTitleSorted) {
      this.issues.sort((a, b) => {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      })
      this.isTitleSorted = true;
    }
    else {
      this.issues.sort((a, b) => {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x < y) { return 1; }
        if (x > y) { return -1; }
        return 0;
      })
      this.isTitleSorted = false;
    }

  }

  //sorting table on the basis of status
  public sortOnStatus() {
    if (this.isStatusSorted) {
      this.issues.sort((a, b) => {
        let x = a.status.toLowerCase();
        let y = b.status.toLowerCase();
        if (x < y) { return 1; }
        if (x > y) { return -1; }
        return 0;
      });
      this.isStatusSorted = false;
    }
    else {
      this.issues.sort((a, b) => {
        let x = a.status.toLowerCase();
        let y = b.status.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      });
      this.isStatusSorted = true;
    }
  }

  //sorting table on the basis of reporter
  public sortOnReporter() {
    if (this.isReporterSorted) {

      this.issues.sort((a, b) => {
        let x = a.reporter.reporterName.toLowerCase();
        let y = b.reporter.reporterName.toLowerCase();
        if (x < y) { return 1; }
        if (x > y) { return -1; }
        return 0;

      })
      this.isReporterSorted = false;
    }
    else {
      this.issues.sort((a, b) => {
        let x = a.reporter.reporterName.toLowerCase();
        let y = b.reporter.reporterName.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;

      })
      this.isReporterSorted = true;
    }
  }

  //sorting on the basis of date
  public sortOnDate() {
    if (this.isDateSorted) {
      this.issues.sort((a, b) => {
        let x = new Date(a.createdOn).getTime()
        let y = new Date(b.createdOn).getTime();

        if (x < y) { return 1 }
        if (x > y) { return -1 }
        return 0;

      })
      this.isDateSorted = false
    }
    else {
      //console.log(this.issues)
      this.issues.sort((a, b) => {
        let x = new Date(a.createdOn).getTime()
        let y = new Date(b.createdOn).getTime();

        if (x < y) { return -1 }
        if (x > y) { return 1 }
        return 0;

      })
      this.isDateSorted = true
    }
  }


}
