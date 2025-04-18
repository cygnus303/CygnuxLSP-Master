import { Routes } from '@angular/router';
import { DocketListComponent } from './docket/docket-list.component';
import { PodUploadComponent } from './pod-upload/pod-upload.component';
import { DocketLayoutComponent } from './docket-layout/docket-layout.component';
import { StatusListComponent } from './status-list/status-list.component';

export const DocketRoutes: Routes = [
  {
    path: 'list',
    component: DocketLayoutComponent,
    children: [
      { path: 'list', component: DocketListComponent },
      { path: 'status-list', component: StatusListComponent },
      { path: 'pod-upload', component: PodUploadComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' } // default child
    ]
  }
];
