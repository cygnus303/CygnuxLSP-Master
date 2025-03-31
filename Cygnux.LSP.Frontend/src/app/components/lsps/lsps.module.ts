import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LspListComponent } from './lsp/lsp-list.component';
import { AddLspComponent } from './add-lsp/add-lsp.component';
import { LspRoutes } from './lsps.routes';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LspDetailComponent } from './lsp-detail/lsp-detail.component';


@NgModule({
    declarations: [
        LspListComponent,
        AddLspComponent,
        LspDetailComponent
    ],
    imports: [
        RouterModule.forChild(LspRoutes),
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        NgbPaginationModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LspModule { }
