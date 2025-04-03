import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrackTraceRoutes } from './track-trace.routes';
import { TrackTraceComponent } from './track-trace.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TrackTraceComponent],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    FormsModule,
    RouterModule.forChild(TrackTraceRoutes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackTraceModule { }
