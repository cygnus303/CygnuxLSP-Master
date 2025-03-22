import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleListComponent } from './role/role-list.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { RoleRoutes } from './roles.routes';
import { RolePermissionComponent } from './role-permission/role-permission.component';

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
        FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoleModule { }
