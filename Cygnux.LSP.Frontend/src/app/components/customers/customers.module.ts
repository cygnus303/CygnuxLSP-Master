import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer/customer-list.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerRoutes } from './customer.routes';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RoleModule } from '../roles/roles.module';
import { RolePermissionComponent } from '../roles/role-permission/role-permission.component';

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
        CustomerListComponent,
        RolePermissionComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerModule { }
