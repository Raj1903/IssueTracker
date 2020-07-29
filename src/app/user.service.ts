import { Injectable } from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:3000/api/v1/user";

  constructor(
    private http:HttpClient
  ) { }

  /**
   * User Login and signup
   */

  // login function 
  public loginFunction(email,password):Observable<any>
  {
    let params = new HttpParams()
    .set('email',email)
    .set('password',password);

    return this.http.post(`${this.baseUrl}/login`,params);
  }
  //login function end

  //signup function
  public signUpFunction(data)
  {
    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName) 
    .set('email',data.email)
    .set('password',data.password)
    .set('mobileNumber',data.mobileNumber)

    return this.http.post(`${this.baseUrl}/signup`,params);
  }// signup function end

  //logout function
  public logout(authToken)
  {
    const params = new HttpParams().set('authToken',authToken)
    return this.http.post(`${this.baseUrl}/signout`,params);
  } //logout end

  /*getting all users function
  */
  public getAllUsers(authToken)
  {
    return this.http.get(`${this.baseUrl}/view/all?authToken=${authToken}`);
  } //end getting all users

  //resetting passoword function
  public resetPasswordFunction(email)
  {
    let data ={};
    return this.http.post(`${this.baseUrl}/${email}/forgotpassword`,data)
  }// reseting password function ends

  
    //set user details on local storage
    public setUserDetailsOnLocalStorage(data)
    {
      localStorage.setItem('userDetails',JSON.stringify(data));
    } //end set user details

    //get user details 
    public getUserDetailsFromLocalStorage()
    {
      return JSON.parse(localStorage.getItem('userDetails'));
    }// end get user details

    //remove userDetails
    public removeUserDetailsFromLocalStorage()
    {
      localStorage.removeItem('userDetails');
    }

}
