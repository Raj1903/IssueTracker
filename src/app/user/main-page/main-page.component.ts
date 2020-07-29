import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router'

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobileNumber: number;
  public emailId: any;
  public password: any;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.userService.getUserDetailsFromLocalStorage()) {
      this.router.navigate(['/home'])
    }
  } //code for localStorage Session Maintain

  public signUpFunction = () => {
    if (!this.firstName) {
      this.toastr.warning('Please Enter Your FirstName')
    }

    else if (!this.lastName) {
      this.toastr.warning('Please Enter Your lastName');
    }

    else if (!this.mobileNumber) {
      this.toastr.warning('Please Enter Your MobileNumber')
    }

    else if (!this.emailId) {
      this.toastr.warning('Please Enter Your EmailId');
    }

    else if (!this.password) {
      this.toastr.warning('Please Enter Your Unique Password')
    }

    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.emailId,
        password: this.password,
        mobileNumber: this.mobileNumber
      }
      console.log(data);

      this.userService.signUpFunction(data).subscribe(
        (apiresponse) => {
          console.log(apiresponse)

          if (apiresponse['status'] === 200) {
            this.toastr.success('signup successfull');
            this.router.navigate(['/welcome']) //clean Input Field
            
          }
          else {
            this.toastr.error(apiresponse['message'])
            //console.log(apiresponse)
          }
        },
        (err) => {
          setTimeout(() => {
            this.router.navigate(['/server/error'])
          }, 2000);
        }
      )
    } // end condition
  } // end SignUpFunction


}
