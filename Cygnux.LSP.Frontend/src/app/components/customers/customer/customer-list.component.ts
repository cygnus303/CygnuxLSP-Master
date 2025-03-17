import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CustomerService } from '../../../shared/services/customer.service';
import { CommonService } from '../../../shared/services/common.service';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import * as bootstrap from "bootstrap"; // Ensure Bootstrap is imported correctly
import $ from "jquery"; // Ensure jQuery is properly imported
import "jsgrid";


declare global {
  interface JQuery {
    jsGrid: (config?: any) => any;
  }
}

interface DataItem {
  task: string;
  email: string;
  phone: string;
  assign: string;
  date: string;
  price: number;
  status: string;
  progress: number;
}

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  public customers: CustomerResponse[] = [];
  public customerCode: string = '';
  selectedCustomer: CustomerResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  @Output() edit = new EventEmitter<CustomerResponse>();

  constructor(
    private customerService: CustomerService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {}
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(page: number = 1) {
    this.commonService.updateLoader(true);
    this.customerService.getCustomerList(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
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

  deleteCustomer() {
    this.commonService.updateLoader(true);
    this.customerService.deleteCustomer(this.customerCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.getCustomers();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  editModal(event: Event, customerCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCustomer(customerCode);
    }
  }
  deleteModal(event: Event, customerCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.customerCode = customerCode;
      modal.show();
    }
  }
  getCustomer(customerCode: string) {
    this.commonService.updateLoader(true);
    this.customerService.getCustomerDetails(customerCode).subscribe({
      next: (response) => {
        if (response) {
          this.selectedCustomer = response.data;
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
  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement); // Using Bootstrap's JS modal method
      this.selectedCustomer = null;
      this.customerCode = '';
      modal.show();
    }
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

      this.getCustomers();
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getCustomers(this.page);
  }
  db: any = { clients: [] }; // Dummy database

  data: DataItem[] = [
    { task: 'Flutter', email: 'jemtiangson@gmail.com', phone: '+917458883210', assign: 'Connor Senration', date: '26/09/2022', price: 315.00, status: 'Pending', progress: 42 },
    { task: 'React', email: 'Bmwdigmail.com', phone: '+50 7414253687', assign: 'Christopnar Mocure', date: '12/07/2022', price: 0, status: '', progress: 30 }, // Example with missing data
    // ... more data items
    { task: 'Shopify', email: 'Petkart@gmail.com', phone: '+91 8080907062', assign: 'Concur Jonresto', date: '', price: 1599.50, status: 'Paming', progress: 42 },
  ];

  currentPage = 1;
  itemsPerPage = 10; // Adjust as needed

  get pagedData(): DataItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Example edit function (replace with your actual logic)
  editItem(item: DataItem): void {
    console.log('Editing item:', item);
    // Implement your edit logic here (e.g., open a modal, navigate to an edit page)
  }

  // Example delete function
  deleteItem(item: DataItem): void {
    console.log('Deleting item:', item);
    this.data = this.data.filter(i => i !== item); // Remove from the array
  }
}
