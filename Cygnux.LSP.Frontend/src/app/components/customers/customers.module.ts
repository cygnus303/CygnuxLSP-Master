import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer/customer-list.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerRoutes } from './customer.routes';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        CustomerListComponent,
        AddCustomerComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(CustomerRoutes),
        ReactiveFormsModule,
        FormsModule,
        NgbPaginationModule
    ]
})
export class CustomerModule { }
