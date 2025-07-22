import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LspTatListComponent } from './lsp-tat/lsp-tat-list.component';
import { AddLspTatComponent } from './add-lsp-tat/add-lsp-tat.component';
import { LspTatRoutes } from './lsp-tats.routes';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { LspTatsDetailComponent } from './lsp-tats-detail/lsp-tats-detail.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImportLspTatComponent } from './import-lsp-tat/import-lsp-tat.component';

@NgModule({
    declarations: [
        LspTatListComponent,
        AddLspTatComponent,
        LspTatsDetailComponent,
        ImportLspTatComponent
    ],
    imports: [
        RouterModule.forChild(LspTatRoutes),
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        NgbPaginationModule,
        NgSelectModule,
        PopoverModule,
        CountUpDirective,
        NgxDropzoneModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LspTatModule { }
