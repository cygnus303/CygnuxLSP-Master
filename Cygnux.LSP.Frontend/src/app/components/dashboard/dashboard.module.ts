import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutes } from './dashboard.routes';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
  ]
})
export class DashboardModule { }
