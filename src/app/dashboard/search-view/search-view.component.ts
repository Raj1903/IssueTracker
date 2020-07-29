import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from 'src/app/issue.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {
  public searchText:string;
  public userDetail:any;
  public newSearch:string;
  public issues: any;
  public typeOfIssues: string;
  //public userDetail;
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
    private route:ActivatedRoute,
    private issueService:IssueService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    
  }

  public searchField(event)
  {
    this.newSearch='';
    
    if(event.keyCode === 13)
    {
      this.newSearch = this.searchText;
      console.log(this.newSearch)
    }
  }
  public getSearchResult() {
    this.issueService.searchIssue(this.myAuth, this.searchText).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {
          console.log(apiresponse)
          if (apiresponse['data'].length > 0) {
            this.issues = apiresponse['data']
          }
        }
        else {
          this.toastr.warning(apiresponse['message'])
        }
      },
      (error) => {
        setTimeout(() => {
          this.router.navigate(['/server/error'])
        }, 2000);
      }
    )
  }

  public navigateToIssueDetail(issueId) {
    this.router.navigate([`/issue/${issueId}/view`])
  }
  /*
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
*/

}
