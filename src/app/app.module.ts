import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { UserManagementModule } from './user-management/user-management.module';
import { UserModule} from './user/user.module'
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr'
import { DashboardModule } from './dashboard/dashboard.module';
import { ErrorsModule } from './errors/errors.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {FormsModule} from '@angular/forms'
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DashboardModule,
    FormsModule,
    AngularEditorModule,
    ErrorsModule,
    //UserManagementModule,
    UserModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut:2000,
      positionClass:'toast-top-right',
      preventDuplicates:true
    }),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
