import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import {ToastrService} from 'ngx-toastr';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginEmail: string;
  public loginPassword: any;

  constructor(private userService: UserService,
    private toastr: ToastrService,
    private router: Router) { }

 // ngOnInit(): void {
 // }
 ngOnInit() {
  //maintaining session from local storage
  if (this.userService.getUserDetailsFromLocalStorage()) {
    this.router.navigate(['/home'])
  }

 }
 //login function
 public loginFunction() {
  if (!this.loginEmail) {
    this.toastr.warning('Email Id is missing')//It Will show as notification on right hand side on top
  }
  else if (!this.loginPassword) {
    this.toastr.warning('Enter Your Password')//notification on screen
  }
  else {
    this.userService.loginFunction(this.loginEmail, this.loginPassword).subscribe(
      (apiresponse) => {
        if (apiresponse['status'] === 200) {
          this.toastr.success('login successfull');//notifiaction after login successfully
          console.log(apiresponse)

          //set user details on local storage
          let data =
          {
            authToken: apiresponse['data']['authToken'],
            userId: apiresponse['data']['userDetails']['userId'],
            firstName: apiresponse['data']['userDetails']['firstName']
          }
          this.userService.setUserDetailsOnLocalStorage(data);
          // end of setting userdetails on local storage

          //navigate to home page after logging successfully
          setTimeout(() => {
            this.router.navigate(['/create'])//after Login page will direct to create page
          }, 100);

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
}//end of login funcion
}
