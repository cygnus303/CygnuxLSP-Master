import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Modal } from 'bootstrap';
import { UserResponse } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '../../../shared/services/identity.service';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  public users: UserResponse[] = [];
  public userCode: string = '';
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public selectedUser: UserResponse | null = null;
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!:Subscription;
 public loading : boolean = false;
  @Output() edit = new EventEmitter<UserResponse>();
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;

  constructor(
    private userService: UserService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private sweetAlertService:SweetAlertService,
    private identityService:IdentityService
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Users');
  }
 
  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getUsers();
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res)=>{
      if (res) { 
        this.commonService.menuRoleList = res;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
     });
  }

  ngAfterViewInit(): void {}
  getUsers(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      userId:this.identityService.getLoggedUserId()
    };
    this.userService.getUserList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.users = response.data;
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

  deleteUser() {
    this.commonService.updateLoader(true);
    this.userService.deleteUser(this.userCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getUsers();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  editModal(event: Event, userCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getUser(userCode);
    }
  }
  deleteModal(event: Event, userCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.userCode = userCode;
      modal.show();
    }
  }
  getUser(userCode: string) {
    this.commonService.updateLoader(true);
    this.userService.getUserDetails(userCode,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedUser = response.data;
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
      this.getUsers();
    }
  }
  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement); // Using Bootstrap's JS modal method
      this.userCode = '';
      this.selectedUser = null;
      modal.show();
      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
          modal.hide(); 
          modalElement.removeEventListener('click', handleOutsideClick);
          this.addUserComponent.onClose();
        }
      };
      modalElement.addEventListener('click', handleOutsideClick);
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getUsers(this.page);
  }

  usersDetail(event: Event, id: string){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('usersDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getUser(id);
    }
  }

  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }
}
