import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { RolePermissionService } from '../../../shared/services/role-permission.service';
import { RolePermissionResponse } from '../../../shared/models/role-permission.model';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../../../shared/services/toastr.service';

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html'
})
export class RolePermissionComponent implements OnInit {
    public allChecked : boolean= false;
    public allViewChecked : boolean= false;
    public allCreateChecked : boolean= false;
    public allEditChecked : boolean= false;
    public allDeleteChecked : boolean= false;
    public allPermission: boolean= false;
    public menus: RolePermissionResponse[] = [];
    @Input() roleId: any;
    @Output() permissionEmitter: EventEmitter<void> = new EventEmitter();
    
    constructor(
        private commonService: CommonService,
        private rolePermissionService: RolePermissionService,
        private toastrService: ToastrService,
        private sweetAlertService:SweetAlertService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['roleId'] && this.roleId) {
            this.getMenus();
        }
    }

    getMenus() {
        this.rolePermissionService.getRolePermissionByRole(this.roleId).subscribe({
            next: (response) => {
                if (response) {
                    this.menus = response.data;
                    this.updateMainCheckbox();
                }
            },
            error: (response: any) => {
                this.toastrService.error(response.error.message);
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
        const allPermissionsSelected = menu.canView && menu.canCreate && menu.canEdit && menu.canDelete;
        if (!allPermissionsSelected) {
            this.allChecked = false;
        }
        this.updateMainCheckbox();
    }
    

    savePermissions(): void {
        this.rolePermissionService.createRolePermission(this.roleId, this.menus).subscribe({
            next: (response) => {
                if (response.success) {
                    this.permissionEmitter.emit();
                    window.location.reload();
                    this.sweetAlertService.success(response.data.message);
                } else {
                    this.sweetAlertService.error(response.error.message);
                }
            },
            error: (response: any) => {
                this.sweetAlertService.error(response.error.message);
            },
        });
    }
}
