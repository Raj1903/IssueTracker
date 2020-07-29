import { Component, OnInit } from '@angular/core'
import { IssueService } from 'src/app/issue.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.css']
})
export class MyReportsComponent implements OnInit {
 // @Input() issueType: string;//string should be either of myissues,myreports,allissues,searchissues;
 // @Input() searchText: string;

  public issues: any;//will hold records of issues based on type of current issue;
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

  constructor(
    private issueService: IssueService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userDetail = this.userService.getUserDetailsFromLocalStorage();
    this.myId = this.userDetail.userId;
    this.myAuth = this.userDetail.authToken;
    //this.typeOfIssues = this.issueType;
  }
  public getReportedIssues() {
    this.issueService.IssuesReportedByUser(this.myId, this.myAuth, this.pageValue * 6).subscribe(
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

}
