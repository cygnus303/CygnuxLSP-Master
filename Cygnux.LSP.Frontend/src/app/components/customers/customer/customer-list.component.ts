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
  public customerId: string = '';
  public selectedCustomer: CustomerResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!:Subscription;
  public loading : boolean = false;
  @Output() edit = new EventEmitter<CustomerResponse>();
  @ViewChild(AddCustomerComponent) addCustomerComponent!: AddCustomerComponent;
  public hoveredRow: number | null = null;
  constructor(
    private customerService: CustomerService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Customer');
  }


    customerCard = [
    { name: 'Total Customer', color: 'red', icon: 'fa-solid fa-book', progress: "progress-gradient-danger", headerColor: 'header-text-danger', count:20},
    { name: 'Active', color: 'blue', icon: 'fa fa-star', progress: "progress-gradient-primary", headerColor: 'header-text-primary' , count:20},
    { name: 'In-Active', color: 'purple', icon: 'fa fa-star-o', progress: "progress-gradient-info", headerColor: 'header-text-info', count:20 },
  ];


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
  }

  getCustomers(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
    };
    this.commonService.updateLoader(true);
    this.customerService.getCustomerList(this.identityService.getLoggedUserId(),filters).subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
          this.totalItems = response.totalCount;
          this.commonService.updateLoader(false);
        }
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);

      },
    });
  }

  mappingCustomer(customerId: string) {
    this.customerService.checkMappingCustomer(customerId).subscribe({
      next: (response) => {
        if (response.data.length <= 1) {
          this.sweetAlertService.delete(
            'Are you sure you want to delete this customer?',
            () => this.deleteCustomer(customerId)
          );
        } else {
        this.sweetAlertService.delete(
          'Are you sure you want to delete this customer? This customer is currently mapped.',
          () => this.deleteCustomer(customerId));
        }
    },
    error: (response: any) => {
      this.sweetAlertService.error(response.error.message);
    },
  });
}

  deleteCustomer(customerId:string) {
    this.customerService.deleteCustomer(customerId).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getCustomers(this.page);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  editModal(event: Event, customerId: string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.customerId = customerId;
      this.getCustomer(customerId);
    }
  }

  getCustomer(customerId: string) {
    this.customerService.getCustomerDetails(customerId,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedCustomer = response.data;
          this.edit.emit(response.data);
        }
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
      },
    });
  }

  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedCustomer = null;
      this.customerId = '';
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

  closeEditModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();

      this.getCustomers(this.page);
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.getCustomers(this.page);
  }

  lspMappingonModal(event: Event, customer: any) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLspMapping');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.getCustomer(customer.customerId);
      modal.show();
    }
  }
  
  closelspMappingModal() {
    const modalElement: any = document.getElementById('exampleModalLspMapping');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  customerDetail(event: Event, customerId: string){
    event.preventDefault();
    const modalElement = document.getElementById('customerDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCustomer(customerId);
    }
  }
  
  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }
}
