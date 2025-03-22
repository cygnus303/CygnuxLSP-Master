import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserRoutes } from './users.routes';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        UserListComponent,
        AddUserComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        ReactiveFormsModule,
        FormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgbPaginationModule,
        NgSelectModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule { }
