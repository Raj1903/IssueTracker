import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ServerErrorComponent } from './server-error/server-error.component';



@NgModule({
  declarations: [NotfoundComponent, ServerErrorComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class ErrorsModule { }
