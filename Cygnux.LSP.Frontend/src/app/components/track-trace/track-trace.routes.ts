import { Routes } from '@angular/router';
import { TrackTraceComponent } from './track-trace.component';
import { TrackDashboardComponent } from './track-dashboard/track-dashboard.component';

export const TrackTraceRoutes: Routes = [
  
  {
    path:'',
    component:TrackDashboardComponent
  },
  {
    path: 'list',
    component: TrackTraceComponent
  }
];