import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { RolePermissionService } from '../../../shared/services/role-permission.service';
import { RolePermissionResponse } from '../../../shared/models/role-permission.model';
import { ToastrService } from '../../../shared/services/toastr.service';

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html'
})
export class RolePermissionComponent implements OnInit {
    @Input() roleId: any;
    @Output() permissionEmitter: EventEmitter<void> = new EventEmitter();

    menus: RolePermissionResponse[] = [];

    allChecked = false;
    allViewChecked = false;
    allCreateChecked = false;
    allEditChecked = false;
    allDeleteChecked = false;
    allPermission=false;

    constructor(
        private commonService: CommonService,
        private rolePermissionService: RolePermissionService,
        private toasterService: ToastrService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['roleId'] && this.roleId) {
            this.getMenus();
        }
    }

    getMenus() {
        this.commonService.updateLoader(true);
        this.rolePermissionService.getRolePermissionByRole(this.roleId).subscribe({
            next: (response) => {
                if (response) {
                    this.menus = response.data;
                    this.updateMainCheckbox();
                }
                this.commonService.updateLoader(false);
            },
            error: (response: any) => {
                this.toasterService.error(response.error.message);
                this.commonService.updateLoader(false);
            },
        });
    }

    toggleColumn(column: string) {
        const isChecked = this.menus.every((menu:any) => menu[column]);
        this.menus.forEach((menu:any) => menu[column] = !isChecked);
        this.updateMainCheckbox();
    }
    

    toggleRow(menu: any, event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        menu.canView = checked;
        menu.canCreate = checked;
        menu.canEdit = checked;
        menu.canDelete = checked;
        this.updateMainCheckbox();
    }

    toggleAllRows(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        this.menus.forEach((menu) => {
            menu.canView = checked;
            menu.canCreate = checked;
            menu.canEdit = checked;
            menu.canDelete = checked;
        });
        this.updateMainCheckbox();
    }

    updateMainCheckbox() {
        this.allChecked = this.menus.every(menu => menu.canView && menu.canCreate && menu.canEdit && menu.canDelete);
        this.allViewChecked = this.menus.every(menu => menu.canView);
        this.allCreateChecked = this.menus.every(menu => menu.canCreate);
        this.allEditChecked = this.menus.every(menu => menu.canEdit);
        this.allDeleteChecked = this.menus.every(menu => menu.canDelete);
    }
    

    updatePermissionCheckbox(menu: any) {
        // Check if all permissions are selected for this specific menu
        const allPermissionsSelected = menu.canView && menu.canCreate && menu.canEdit && menu.canDelete;
    
        // Update the main menu checkbox state dynamically without adding `isChecked`
        if (!allPermissionsSelected) {
            this.allChecked = false; // Uncheck the "Menu Name" checkbox if any permission is unchecked
        }
    
        // Update the main header checkboxes to reflect the current state
        this.updateMainCheckbox();
    }
    

    savePermissions(): void {
        this.commonService.updateLoader(true);
        this.rolePermissionService.createRolePermission(this.roleId, this.menus).subscribe({
            next: (response) => {
                if (response.success) {
                    this.permissionEmitter.emit();
                    this.toasterService.success(response.data.message);
                } else {
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
