import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrackTraceRoutes } from './track-trace.routes';
import { TrackTraceComponent } from './track-trace.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FormsModule } from '@angular/forms';
import { TrackDashboardComponent } from './track-dashboard/track-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CountUpDirective } from '../../shared/directives/count-up.directive';

@NgModule({
  declarations: [TrackTraceComponent,TrackDashboardComponent],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    FormsModule,
    RouterModule.forChild(TrackTraceRoutes),
    NgApexchartsModule,
    BsDatepickerModule.forRoot(),
    CountUpDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackTraceModule { }
