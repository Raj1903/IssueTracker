import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { IssueService } from 'src/app/issue.service';
import { Router } from '@angular/router';
//import '@github/file-attachment-element'


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [Location]
})
export class CreateComponent implements OnInit {
  public title: any;
  //public title: number;
  public description: string;
  public selectedStatus;
  public statusOptions = ['backlog', 'in-progress', 'in-test', 'done'];
  public selectedAssignee;
  private myAuth: any;
  private userDetail;
  public allUsersExcludingMe;
  public dropdownSelected: any = "assign-to";

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
    private location: Location,
    private toastr: ToastrService,
    private userService: UserService,
    private issueService: IssueService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userDetail = this.userService.getUserDetailsFromLocalStorage();
    this.myAuth = this.userDetail.authToken;
    this.getAllUsers()
  }

  //All Users Data Collection
  public getAllUsers() {
    this.userService.getAllUsers(this.myAuth).subscribe(
      (apiresponse) => {
        console.log(apiresponse)
        if (apiresponse['status'] === 200) {
          let allUsers = apiresponse['data'];
          this.removeMyselfFromAllUsers(allUsers)
        }
      },
      (error) => {
        setTimeout(() => {
          this.router.navigate(['/server/error'])
        }, 2000);
      }
    )
  }//end of getting all users

  //function to create new issue
  public createIssueFunction() {
    if (this.title  && this.selectedStatus && this.description) {
      let data: any;
      //this info will send to the assigne

      if (this.selectedAssignee) {
        data =
          {
            title: this.title,
            status: this.selectedStatus,
            description: this.description,
            assigneeId: this.selectedAssignee.userId,
            assigneeName: this.selectedAssignee.firstName + " " + this.selectedAssignee.lastName,
            authToken: this.myAuth,
            reporterId: this.userDetail.userId,
            reporterName: this.userDetail.firstName  
          };
      }
      // if not selected then this data will be sent
      else {
        data =
          {
            title: this.title,
            status: this.selectedStatus,
            description: this.description,
            authToken: this.myAuth,
            reporterId: this.userDetail.userId,
            reporterName: this.userDetail.firstName
          }

      }

      //Service call function
      this.issueService.createIssueFunction(data).subscribe(
        (apiresponse) => {
          if (apiresponse['status'] === 200) {
            console.log(apiresponse)
            this.toastr.success('Issue created');
            let issueId = apiresponse['data']['issueId'];
            setTimeout(() => {
              this.router.navigate([`issue/${issueId}/view`])
            }, 1000)
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
      //console.log(data)
    }
    else {
      this.toastr.warning('one or more field is missing')
    }
  }//end of creating issue

  

  //removing myself from all users
  public removeMyselfFromAllUsers(allUsers) {
    allUsers.forEach((user, index) => {
      if (user.userId === this.userDetail.userId) {
        allUsers.splice(index, 1);
      }
    })

    this.allUsersExcludingMe = allUsers;
  }//end of removing myself from all users

  //userdetail of user selected from dropdown of assignees
  public selectedUser(user) {
    //change dropdownselcected button name to user selected name
    this.dropdownSelected = user.firstName;

    //initialize selectedAssignee
    this.selectedAssignee = user;
  }



  public navigateBack() {
    this.location.back()
  }

  public focused() {
    //console.log('focused')
  }

}
