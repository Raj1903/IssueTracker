import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { CreateComponent } from './create/create.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AllissuesComponent } from './allissues/allissues.component';
//import { IssuesComponent } from './issues/issues.component';
import { MyReportsComponent } from './my-reports/my-reports.component';
import { IssueDetailComponent } from './issue-detail/issue-detail.component';
import { EditComponent } from './edit/edit.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [HomeComponent, CreateComponent, AllissuesComponent,  MyReportsComponent, IssueDetailComponent, EditComponent, SearchViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    AngularEditorModule
  ]
})
export class DashboardModule { }
