import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RoleService } from '../../../shared/services/role.service';
import { CommonService } from '../../../shared/services/common.service';
import { RoleResponse } from '../../../shared/models/role.model';
import { Modal } from 'bootstrap';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { Subscription } from 'rxjs';
import feather from 'feather-icons';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { AddRoleComponent } from '../add-role/add-role.component';
import { SignalRService } from '../../../shared/services/signal-r.service';

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
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public selectedRole: RoleResponse | null = null;
  public roleName: string | null = null;
  public RoleListsubscribe!: Subscription;
  public loading: boolean = false;
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public hoveredRow: number | null = null;
  @Output() edit = new EventEmitter<RoleResponse>();
  @ViewChild(AddRoleComponent) addRoleComponent!: AddRoleComponent;

  constructor(
    private roleService: RoleService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private sweetAlertService: SweetAlertService,
    private signalRService: SignalRService,
  ) {
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Roles');
  }

  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getRoles();
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res) => {
      if (res) {
        this.commonService.menuRoleList = res;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    this.getRoles();

    this.signalRService.startConnection();

    this.signalRService.startConnection().then(() => {
      this.signalRService.on('RoleListUpdated', (msg) => {
        this.getRoles();
      });
    });
  }

  ngAfterViewInit(): void {
    feather.replace();
  }
  getRoles(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    this.commonService.updateLoader(true);
    const filters = {
      ...this.filters,
      Page: this.page,
      PageSize: this.pageSize
    }
    this.roleService.getRoleList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.roles = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toastrService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  deleteRole(roleId: string) {
    const payload = {
      id: roleId,
      isDeleted: true
    }
    this.roleService.deleteRole(roleId, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getRoles();
        this.closeDeleteModal();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  editModal(event: Event, roleId: string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getRole(roleId);
    }
  }
  deleteModal(event: Event, roleId: string) {
    event.preventDefault();
    // const modalElement = document.getElementById('deleteModal');
    // if (modalElement) {
    //   const modal = new Modal(modalElement);
    //   this.roleId = roleId;
    //   modal.show();
    // }

    this.sweetAlertService.delete(
      'Are you sure you want to delete this Role?',
      () => this.deleteRole(roleId)
    );
  }

  permissionModal(event: Event, roleList: any) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalPermission');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedRoleId = roleList.id;
      this.roleName = roleList.roleName
      this.selectedRoleId = '';
      setTimeout(() => {
        this.selectedRoleId = roleList.id;
        modal.show();
      }, 0);
    }
  }
  getRole(roleId: string) {
    this.roleService.getRoleDetails(roleId).subscribe({
      next: (response) => {
        if (response) {
          this.selectedRole = response.data;
          this.edit.emit(response.data);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  closeDeleteModal() {
    const modalElement: any = document.getElementById('deleteModal');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  closeEditModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();

      this.getRoles();
    }
  }
  closePermissionModal() {
    const modalElement: any = document.getElementById('exampleModalPermission');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      // this.getRoles();
    }
  }

  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.roleId = '';
      this.selectedRole = null;
      modal.show();
      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
          modal.hide();
          modalElement.removeEventListener('click', handleOutsideClick);
          this.addRoleComponent.onClose();
        }
      };
      modalElement.addEventListener('click', handleOutsideClick);
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.getRoles(this.page);
  }

  ngOnDestroy(): void {
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
  }
}
