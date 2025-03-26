import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer/customer-list.component';

export const CustomerRoutes: Routes = [
  {
    path: 'list',
    component: CustomerListComponent
  }
];
