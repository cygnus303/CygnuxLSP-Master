import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LspMappingListComponent } from './lsp-mapping/lsp-mapping-list.component';
import { AddLspMappingComponent } from './add-lsp-mapping/add-lsp-mapping.component';
import { LspMappingRoutes } from './lsp-mappings.routes';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { LspMappingsDetailComponent } from './lsp-mappings-detail/lsp-mappings-detail.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { SearchListPipe } from '../../shared/Pipe/search-list.pipe';


@NgModule({
    declarations: [
        LspMappingListComponent,
        AddLspMappingComponent,
        LspMappingsDetailComponent
    ],
    imports: [
        RouterModule.forChild(LspMappingRoutes),
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgbPaginationModule,
        NgSelectModule,
        PopoverModule,
        CountUpDirective,
        SearchListPipe
    ],
    exports:[AddLspMappingComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LspMappingModule { }
