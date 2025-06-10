import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer/customer-list.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerRoutes } from './customer.routes';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LspMappingModule } from '../lsp-mappings/lsp-mappings.module';
import { AddLspMappingComponent } from '../lsp-mappings/add-lsp-mapping/add-lsp-mapping.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
    declarations: [
        CustomerListComponent,
        AddCustomerComponent,
        CustomerDetailComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        RouterModule.forChild(CustomerRoutes),
        ReactiveFormsModule,
        FormsModule,
        LspMappingModule,
        NgbPaginationModule,
        PopoverModule
    ],
    exports: [
        CustomerListComponent,
        AddLspMappingComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule { }
