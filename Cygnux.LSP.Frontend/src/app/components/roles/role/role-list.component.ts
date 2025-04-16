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
import { Modal } from 'bootstrap';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import feather from 'feather-icons';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../../../shared/services/toastr.service';

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
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  selectedRole: RoleResponse | null = null;
  roleName: string | null = null;
  @Output() edit = new EventEmitter<RoleResponse>();
  RoleListsubscribe!:Subscription;
  constructor(
    private roleService: RoleService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private sweetAlertService:SweetAlertService
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Roles');
  }

  ngOnInit(): void {
    this.getRoles();
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
    this.RoleListsubscribe= this.commonService.activemenuRoleList.subscribe((res)=>{
      if (res) { 
        this.commonService.menuRoleList = res;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("Updated from activemenuRoleList:", res);
      }
     });
    // this.route.paramMap.subscribe(params => {
    //   const navigationState = history.state;
    //   if (navigationState && navigationState.start) {
    //     this.commonService.menuRoleList = navigationState.start;
    //     console.log(this.commonService.menuRoleList)
    //   }
    // });
  }
  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }
  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
  }
  getRoles(page: number = 1) {
    this.commonService.updateLoader(true);
    this.roleService.getRoleList(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.roles = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toastrService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  deleteRole() {
    this.commonService.updateLoader(true);
    this.roleService.deleteRole(this.roleId).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getRoles();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
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
  permissionModal(event: Event, roleList: any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalPermission');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedRoleId = roleList.id;
      this.roleName = roleList.roleName
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
        this.sweetAlertService.error(response.error.message);
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

  onPageChange(page: number) {
    this.page = page;
    this.getRoles(this.page);
  }
}
