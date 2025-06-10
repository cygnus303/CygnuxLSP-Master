import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleListComponent } from './role/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { RoleRoutes } from './roles.routes';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
    declarations: [
        RoleListComponent,
        AddRoleComponent,
        RolePermissionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(RoleRoutes),
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        NgbPaginationModule,
        NgSelectModule,
        PopoverModule
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoleModule { }
