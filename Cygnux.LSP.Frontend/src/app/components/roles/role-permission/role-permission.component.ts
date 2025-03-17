// menu-permissions.component.ts
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { RolePermissionService } from '../../../shared/services/role-permission.service';
import { ToastrService } from 'ngx-toastr';
import { RolePermissionResponse } from '../../../shared/models/role-permission.model';

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html'
})
export class RolePermissionComponent implements OnInit {
    @Input() roleId: any;
    @Output() permissionEmitter: EventEmitter<void> = new EventEmitter();

    menus: RolePermissionResponse[] = [];
    // [
    //     { id: 1, name: 'Dashboard', permissions: { view: false, create: false, edit: false, delete: false } },
    //     { id: 2, name: 'Users', permissions: { view: false, create: false, edit: false, delete: false } },
    //     { id: 3, name: 'Settings', permissions: { view: false, create: false, edit: false, delete: false } }
    // ];

    constructor(private commonService: CommonService,
        private rolePermissionService: RolePermissionService,
        private toasterService: ToastrService) { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['roleId'] && this.roleId) {
            this.getMenus();
        }
    }
    getMenus() {
        this.commonService.updateLoader(true);
        this.rolePermissionService.getRolePermissionByRole(this.roleId)
            .subscribe({
                next: (response) => {
                    if (response) {
                        this.menus = response.data;
                    }
                    this.commonService.updateLoader(false);
                },
                error: (response: any) => {
                    this.toasterService.error(response.error.message);
                    this.commonService.updateLoader(false);
                },
            });
    }

    // Function to toggle permission
    togglePermission(menuId: string, permissionType: 'view' | 'create' | 'edit' | 'delete') {
        const menu = this.menus.find(m => m.menuId === menuId);
        if (menu) {
            switch (permissionType) {
                case 'view':
                    menu.canView = !menu.canView;
                    break;
                case 'create':
                    menu.canCreate = !menu.canCreate;
                    break;
                case 'edit':
                    menu.canEdit = !menu.canEdit;
                    break;
                case 'delete':
                    menu.canDelete = !menu.canDelete;
                    break;
            }
        }
    }

    savePermissions(): void {
        this.commonService.updateLoader(true);
        this.rolePermissionService.createRolePermission(this.roleId, this.menus)
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.permissionEmitter.emit();
                        this.toasterService.success(response.data.message);
                    }
                    else {
                        this.toasterService.error(response.error.message);
                    }
                    this.commonService.updateLoader(false);
                },
                error: (response: any) => {
                    this.toasterService.error(response.error.message);
                    this.commonService.updateLoader(false);
                },
            });
    }
}
