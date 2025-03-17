import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { UserResponse } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  public users: UserResponse[] = [];
  public userCode: string = '';
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  selectedUser: UserResponse | null = null;

  @Output() edit = new EventEmitter<UserResponse>();

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {}
  getUsers(page: number = 1) {
    this.commonService.updateLoader(true);
    this.userService.getUserList(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.users = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  deleteUser() {
    this.commonService.updateLoader(true);
    this.userService.deleteUser(this.userCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.getUsers();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
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
    this.userService.getUserDetails(userCode).subscribe({
      next: (response) => {
        if (response) {
          this.selectedUser = response.data;
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
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getUsers(this.page);
  }
}
