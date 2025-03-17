import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { RoleService } from '../../../shared/services/role.service';
import { CommonService } from '../../../shared/services/common.service';
import { RoleResponse } from '../../../shared/models/role.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, AfterViewInit {
  public roles: RoleResponse[] = [];
  public roleId: string = '';
  public selectedRoleId: string = '';

  selectedRole: RoleResponse | null = null;

  @Output() edit = new EventEmitter<RoleResponse>();

  constructor(
    private roleService: RoleService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  ngAfterViewInit(): void {}
  getRoles() {
    this.commonService.updateLoader(true);
    this.roleService.getRoleList().subscribe({
      next: (response) => {
        if (response) {
          this.roles = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  deleteRole() {
    this.commonService.updateLoader(true);
    this.roleService.deleteRole(this.roleId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.getRoles();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  editModal(event: Event, roleId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getRole(roleId);
    }
  }
  deleteModal(event: Event, roleId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.roleId = roleId;
      modal.show();
    }
  }
  permissionModal(event: Event, roleId: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalPermission');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedRoleId = roleId;
      modal.show();
    }
  }
  getRole(roleId: string) {
    this.commonService.updateLoader(true);
    this.roleService.getRoleDetails(roleId).subscribe({
      next: (response) => {
        if (response) {
          this.selectedRole = response.data;
          this.edit.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  closeDeleteModal() {
    const modalElement: any = document.getElementById('deleteModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
    }
  }
  closeEditModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal

      this.getRoles();
    }
  }
  closePermissionModal() {
    const modalElement: any = document.getElementById('exampleModalPermission');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getRoles();
    }
  }
  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement); // Using Bootstrap's JS modal method
      this.roleId = '';
      this.selectedRole = null;
      modal.show();
    }
  }
}
