import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DocketListComponent } from './docket/docket-list.component';
import { AddDocketComponent } from './add-docket/add-docket.component';
import { DocketRoutes } from './dockets.routes';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [DocketListComponent, AddDocketComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DocketRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocketModule {}
