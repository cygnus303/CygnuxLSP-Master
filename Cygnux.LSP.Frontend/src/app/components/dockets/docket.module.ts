import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DocketListComponent } from './docket/docket-list.component';
import { DocketRoutes } from './dockets.routes';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PodUploadComponent } from './pod-upload/pod-upload.component';
import { AddDocketComponent } from './docket/add-docket/add-docket.component';
import { DocketDetailComponent } from './docket/docket-detail/docket-detail.component';
import { ImportDocketComponent } from './docket/import-docket/import-docket.component';
import { DocketLayoutComponent } from './docket-layout/docket-layout.component';
import { StatusListComponent } from './status-list/status-list.component';
import { StatusUpdateComponent } from './status-update/status-update.component';

@NgModule({
  declarations: [
    DocketListComponent, 
    AddDocketComponent,
    DocketDetailComponent,
    ImportDocketComponent,
    PodUploadComponent,
    DocketLayoutComponent,
    StatusListComponent,
    StatusUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DocketRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgSelectModule,
    NgxDropzoneModule,
    BsDatepickerModule.forRoot()
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocketModule {}
