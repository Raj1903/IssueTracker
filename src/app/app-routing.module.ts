import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { WelcomePageComponent } from './user-management/welcome-page/welcome-page.component';
import { MainPageComponent} from './user/main-page/main-page.component'
import { HomeComponent } from './dashboard/home/home.component';
import { CreateComponent } from './dashboard/create/create.component';
import { NotfoundComponent } from './errors/notfound/notfound.component';
//import { IssuesComponent } from './dashboard/issues/issues.component';
import { AllissuesComponent } from './dashboard/allissues/allissues.component';
import { MyReportsComponent } from './dashboard/my-reports/my-reports.component';
import { IssueDetailComponent } from './dashboard/issue-detail/issue-detail.component';
import { EditComponent } from './dashboard/edit/edit.component';
import { SearchViewComponent } from './dashboard/search-view/search-view.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
//import { ForgotPasswordComponent } from './user-management/forgot-password/forgot-password.component';
import { PasswordPageComponent } from './user/password-page/password-page.component';
//import { SignupComponent } from './user/signup/signup.component';
import {LoginComponent } from './user/login/login.component';



const routes: Routes = [
  {path:'signup',component:MainPageComponent},
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'create',component:CreateComponent},
  {path:'issues',component:AllissuesComponent},
  //{path: 'issues',component:IssuesComponent},
  {path:'report',component:MyReportsComponent},
  {path:'issue/:issueId/view',component:IssueDetailComponent},
  {path:'issue/:issueId/edit',component:EditComponent},
  {path:'search/:searchText/view',component:SearchViewComponent},
  {path:'server/error',component:ServerErrorComponent},
  {path:'forgot/password',component:PasswordPageComponent},
  {path:'login', component:LoginComponent},
  
  {path:'**',component:NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
