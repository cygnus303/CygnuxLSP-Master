import { Routes } from '@angular/router';
import { DocketListComponent } from './docket/docket-list.component';
import { DocketUpdateComponent } from './docket-update/docket-update.component';
import { PodUploadComponent } from './pod-upload/pod-upload.component';

export const DocketRoutes: Routes = [
  {
    path: '',
    component: DocketListComponent,
  },
  {
    path:'docket-update',
    component:DocketUpdateComponent
  },
  {
    path:'pod-upload',
    component:PodUploadComponent
  }
];
