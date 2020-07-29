import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { IssueService } from 'src/app/issue.service';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common'
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css'],
  providers: [Location]
})
export class IssueDetailComponent implements OnInit {
  public issueId: string;
  public userDetail;
  public issueDetail: any;
  public comments: any[] = [];
  public newComment: string;
  public assignee: any;
  public watchers: any[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private issueService: IssueService,
    private userService: UserService,
    private toastr: ToastrService,
    private location: Location,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    this.userDetail = this.userService.getUserDetailsFromLocalStorage();
    this.getIssueDetail()
    //console.log(this.issueId)
  }

  //getting detail of issue
  public getIssueDetail() {
    if (this.issueId) {
      this.issueService.getIssueDetail(this.issueId, this.userDetail.authToken).subscribe(
        (apiresponse) => {
          if (apiresponse['status'] === 200) {
            //console.log(apiresponse)
            this.issueDetail = apiresponse['data'];
            if (apiresponse['data']['comments'].length > 0) {
              this.comments = apiresponse['data']['comments'];
              this.comments = this.comments.reverse();

            }

            this.assignee = apiresponse['data']['assignee'];
            this.watchers = apiresponse['data']['watchers'];
            //console.log(this.watchers)
            //console.log(this.comments)
            this.addWatchingStatus();
          }
        },
        (error) => {
          setTimeout(() => {
            this.router.navigate(['/server/error'])
          }, 2000);
        }
      )
    }
  }

  //add watching status
  public addWatchingStatus() {
    //if current issue reporter is the user itself then dont do anything if not then set status
    //on the basis of watcherlist
    if (this.userDetail.userId != this.issueDetail.reporter.reporterId) {
      if (this.issueDetail.watchers.length > 0) {
        this.issueDetail.watchers.forEach((watcher) => {
          if (watcher.watcherId === this.userDetail.userId) {
            this.issueDetail.watchingStatus = 'watching'
          }
          else {
            this.issueDetail.watchingStatus = 'watch';
          }
        })
      }
      else {
        this.issueDetail.watchingStatus = "watch";
        //console.log(this.issueDetail)
      }

    }
  }

  //watching the current issue
  public watchIssue() {
    let data =
    {
      issueId: this.issueDetail.issueId,
      watcherId: this.userDetail.userId,
      watcherName: this.userDetail.firstName,
      authToken: this.userDetail.authToken
    }

    this.issueService.addWatcher(data).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {
          //console.log('status 200 : ',apiresponse);
          this.issueDetail.watchingStatus = 'watching';
          this.watchers.push(apiresponse['data']);
          this.notifyUpdates();
        }
        else {
          this.toastr.error(apiresponse['message']);
        }
      },
      (error) => {
        setTimeout(() => {
          this.router.navigate(['/server/error'])
        }, 2000);
      }
    )
  }

  //notifying updates about watchin an issue
  public notifyUpdates() {
    let data =
    {
      issueId: this.issueDetail.issueId,
      assignee: this.issueDetail.assignee,
      reporter: this.issueDetail.reporter,
      watchers: this.issueDetail.watchers,
      userId: this.userDetail.userId,
      message: `${this.userDetail.firstName} is watching an issue`
    }

    this.socketService.notifyUpdates(data)
  }

  //adding new comment
  public addComment() {
    if (this.newComment) {

      let data =
      {
        comment: this.newComment,
        userId: this.userDetail.userId,
        firstName: this.userDetail.firstName,
        authToken: this.userDetail.authToken,
        issueId: this.issueId
      }

      //calling service function for adding comment
      this.issueService.addComment(data).subscribe(
        (apiresponse) => {
          if (apiresponse['status'] === 200) {
            this.toastr.success('comment added');
            //console.log(apiresponse)
            this.comments.unshift(apiresponse['data'])
            //this.getIssueDetail();
            this.notifyAddedComment()
          }
          else {
            this.toastr.error(apiresponse['message'])
          }
        },
        (error) => {
          setTimeout(() => {
            this.router.navigate(['/server/error'])
          }, 2000);

        }
      )
    }

    //after adding comment,empty newComment
    this.newComment = "";
  }

  //notify added commnent
  public notifyAddedComment() {
    let data =
    {
      userId: this.userDetail.userId,
      watchers: this.issueDetail.watchers,
      reporter: this.issueDetail.reporter,
      assignee: this.issueDetail.assignee,
      issueId: this.issueDetail.issueId,
      message: `${this.userDetail.firstName} has added a new comment`

    }
    this.socketService.notifyUpdates(data);

  }

  //adding comment by keypress enter
  public addCommentByKeyPress(event) {
    if (event.keyCode === 13) {
      this.addComment()
    }
  }

  //navigating back on clicking back button
  public navigateBack() {
    this.location.back()
  }

}
