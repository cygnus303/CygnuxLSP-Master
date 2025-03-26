import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer/customer-list.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerRoutes } from './customer.routes';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RolePermissionComponent } from '../roles/role-permission/role-permission.component';
import { RoleModule } from '../roles/roles.module';

@NgModule({
    declarations: [
        CustomerListComponent,
        AddCustomerComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        RouterModule.forChild(CustomerRoutes),
        ReactiveFormsModule,
        FormsModule,
        NgbPaginationModule,
        RoleModule
    ],
    exports: [
        CustomerListComponent,  // ✅ Export Customer components so they can be used in other modules
        RolePermissionComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule { }
