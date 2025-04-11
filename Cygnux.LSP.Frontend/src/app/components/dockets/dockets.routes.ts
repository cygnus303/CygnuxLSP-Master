import { Routes } from '@angular/router';
import { DocketListComponent } from './docket/docket-list.component';
import { PodUploadComponent } from './pod-upload/pod-upload.component';
import { StatusUpdateComponent } from './status-update/status-update.component';

export const DocketRoutes: Routes = [
  {
    path: '',
    component: DocketListComponent,
  },
  {
    path:'docket-update',
    component:StatusUpdateComponent
  },
  {
    path:'pod-upload',
    component:PodUploadComponent
  }
];
