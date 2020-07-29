import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { IssueService } from 'src/app/issue.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [Location]
})
export class EditComponent implements OnInit {
  public title;
  public description;
  public assignees;
  public selectedStatus;
  public statusOptions = ['backlog', 'in-progress', 'in-test', 'done'];
  public dropdownSelected = 'assign-to';
  private userDetail: any;
  public selectedAssignee;
  public allUsers: any[];
  public issueId;
  public issueDetail;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  constructor(
    private userService: UserService,
    private issueService: IssueService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.userDetail = this.userService.getUserDetailsFromLocalStorage();
    this.issueId = this.route.snapshot.paramMap.get('issueId');
    this.getIssueDetail(this.issueId);
    this.getAllUsers();
  }

  /*getting issue detail of passed issueId
  */
  public getIssueDetail(issueId) {
    if (issueId) {
      this.issueService.getIssueDetail(issueId, this.userDetail.authToken).subscribe(
        (apiresponse) => {
          if (apiresponse['status'] === 200) {
            this.issueDetail = apiresponse['data'];
            this.definePropertyValues(this.issueDetail);
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

  /*edit component for property values */
  public definePropertyValues(issueDetail) {
    this.title = issueDetail.title;
    this.selectedStatus = issueDetail.status;
    this.description = issueDetail.description;
  }

  /* all users Issue listed
  */
  public getAllUsers() {
    this.userService.getAllUsers(this.userDetail.authToken).subscribe(
      (apiresponse) => {
        console.log(apiresponse)
        if (apiresponse['status'] === 200) {
          console.log('before splice ; ',apiresponse['data'])
          this.allUsers = apiresponse['data'];

          this.removeMyself()
        }
      },
      (error) => {
        setTimeout(() => {
          this.router.navigate(['/server/error'])
        }, 2000);
      }
    )
  }

  /*removing myself
  */
  public removeMyself() {

    this.allUsers.forEach((user, index) => {
      if (user.userId === this.userDetail.userId) {
        this.allUsers.splice(index, 1);
      }
    })

   
    this.removeAssignees();
    this.removeReporter();
  }

 /*remove assigne*/
  public removeAssignees() {
    let assignees = this.issueDetail.assignee;
    console.log('temp asign : ',assignees)
    if (assignees) {
      assignees.forEach((single, index) => {
        this.allUsers.forEach((user, index) => {
          if (user.userId === single.assigneeId) {
            this.allUsers.splice(index, 1);
          }
        })
      })
    }


  }

  /*removing reporter from allusers*/
  public removeReporter() {
    if (this.userDetail.userId != this.issueDetail.reporter.reporterId) {
      this.allUsers.forEach((user, index) => {
        if (user.userId === this.issueDetail.reporter.reporterId) {
          this.allUsers.splice(index, 1);
        }
      })
    }
  }


  public selectedUser(user) {
    this.selectedAssignee = user;
    this.dropdownSelected = user.firstName;
  }

  public navigateBack() {
    this.location.back();
  }

  /*editing issue
  */
  public editIssue() {
    if (this.title && this.description && this.selectedStatus) {
      let data: any;
      if (this.selectedAssignee) {
        data =
          {
            title: this.title,
            status: this.selectedStatus,
            description: this.description,
            assigneeId: this.selectedAssignee.userId,
            assigneeName: this.selectedAssignee.firstName + " " + this.selectedAssignee.lastName,
            authToken: this.userDetail.authToken,
            issueId: this.issueDetail.issueId
          };
      }
      else {
        data =
          {
            title: this.title,
            status: this.selectedStatus,
            description: this.description,
            authToken: this.userDetail.authToken,
            issueId: this.issueDetail.issueId
          }

      }
      //console.log('data : ', data)

      this.issueService.updateIssue(data).subscribe(
        (apiresponse) => {
          if (apiresponse['status'] === 200) {
            this.toastr.success('issue updated');
            setTimeout(() => {
              this.router.navigate([`/issue/${this.issueDetail.issueId}/view`]);
            }, 1000);

            this.notifyEditedIssue();
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
    else {
      this.toastr.warning('Fill all the fields');
    }

  }

  /*Users will get notiffied for edited issue*/
  public notifyEditedIssue() {
    this.getIssueDetail(this.issueDetail.issueId);
    let data =
    {
      issueId: this.issueDetail.issueId,
      assignee: this.issueDetail.assignee,
      reporter: this.issueDetail.reporter,
      watchers: this.issueDetail.watchers,
      userId: this.userDetail.userId,
      message: `${this.userDetail.firstName} has updated an issue`
    }

    this.socketService.notifyUpdates(data);
  }
}
