import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DocketListComponent } from './docket/docket-list.component';
import { AddDocketComponent } from './add-docket/add-docket.component';
import { DocketRoutes } from './dockets.routes';
import { NgSelectModule } from '@ng-select/ng-select';
import { DocketDetailComponent } from './docket-detail/docket-detail.component';
import { ImportDocketComponent } from "./import-docket/import-docket.component";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DocketUpdateComponent } from './docket-update/docket-update.component';
import { PodUploadComponent } from './pod-upload/pod-upload.component';

@NgModule({
  declarations: [
    DocketListComponent, 
    AddDocketComponent,
    DocketDetailComponent,
    ImportDocketComponent,
    DocketUpdateComponent,
    PodUploadComponent
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
