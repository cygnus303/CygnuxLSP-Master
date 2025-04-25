import {Component,EventEmitter,OnInit,Output, ViewChild} from '@angular/core';
import { CustomerService } from '../../../shared/services/customer.service';
import { CommonService } from '../../../shared/services/common.service';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { IdentityService } from '../../../shared/services/identity.service';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  public customers: CustomerResponse[] = [];
  public customerCode: string = '';
  public selectedCustomer: CustomerResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!:Subscription;
  @Output() edit = new EventEmitter<CustomerResponse>();
  @ViewChild(AddCustomerComponent) addCustomerComponent!: AddCustomerComponent;
  loading = false;

  constructor(
    private customerService: CustomerService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Customer');

    
  }

  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getCustomers();
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
   this.RoleListsubscribe= this.commonService.activemenuRoleList.subscribe((res)=>{
    if (res) { 
      this.commonService.menuRoleList = res;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    });
    // this.route.paramMap.subscribe(params => {
    //   const navigationState = history.state;  
    //   if (navigationState && navigationState.start) {
    //     this.commonService.menuRoleList = navigationState.start;
    //   }
    // });
  }

  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }

  getCustomers(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      UserID:this.identityService.getLoggedUserId(),
      PageSize: this.pageSize,
    };
    this.commonService.updateLoader(true);
    this.customerService.getCustomerList(filters).subscribe({
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
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getCustomers(this.page);
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
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
      this.customerCode = customerCode;
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
    this.customerService.getCustomerDetails(customerCode,this.identityService.getLoggedUserId()).subscribe({
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
      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
          modal.hide(); 
          modalElement.removeEventListener('click', handleOutsideClick);
          this.addCustomerComponent.onClose();
        }
      };
      modalElement.addEventListener('click', handleOutsideClick);
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

      this.getCustomers(this.page);
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getCustomers(this.page);
  }

  lspMappingonModal(event: Event, customer: any) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLspMapping');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.getCustomer(customer.customerCode);
      modal.show();
    }
  }
  closelspMappingModal() {
    const modalElement: any = document.getElementById('exampleModalLspMapping');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getCustomers(this.page);
    }
  }

  customerDetail(event: Event, customerCode: string){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('customerDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCustomer(customerCode);
    }
  }
}
