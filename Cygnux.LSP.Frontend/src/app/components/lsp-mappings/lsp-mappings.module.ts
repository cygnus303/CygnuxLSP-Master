import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LspMappingListComponent } from './lsp-mapping/lsp-mapping-list.component';
import { AddLspMappingComponent } from './add-lsp-mapping/add-lsp-mapping.component';
import { LspMappingRoutes } from './lsp-mappings.routes';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        LspMappingListComponent,
        AddLspMappingComponent
    ],
    imports: [
        RouterModule.forChild(LspMappingRoutes),
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgbPaginationModule,
        NgSelectModule
    ]
})
export class LspMappingModule { }
