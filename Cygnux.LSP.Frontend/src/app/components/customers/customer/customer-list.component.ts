import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { CountResponse } from '../../../shared/models/lsp.model';
import { ExportService } from '../../../shared/services/export.service';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';

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
  public selectedMappingId: LspMappingResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!: Subscription;
  public loading: boolean = false;
  @Output() edit = new EventEmitter<CustomerResponse>();
  @ViewChild(AddCustomerComponent) addCustomerComponent!: AddCustomerComponent;
  public hoveredRow: number | null = null;
  public customerCount: CountResponse[] = [];
  constructor(
    private customerService: CustomerService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private identityService: IdentityService,
    private sweetAlertService: SweetAlertService,
    private exportService: ExportService,
    private lspMappingService: LspMappingService
  ) {
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Customer');
  }
  customerCard = [
    { name: 'Total Customer', color: 'red', icon: 'fa-solid fa-book', progress: "progress-gradient-danger", headerColor: 'header-text-danger' },
    { name: 'Active Customer', color: 'blue', icon: 'fa fa-user-check', progress: "progress-gradient-primary", headerColor: 'header-text-primary' },
    { name: 'In-Active Customer', color: 'purple', icon: 'fa fa-user-slash', progress: "progress-gradient-info", headerColor: 'header-text-info' },
  ];


  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getcustomerCount();
    this.getCustomers();
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res) => {
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
    this.customerService.getCustomerList(this.identityService.getLoggedUserId(), filters).subscribe({
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

  deleteCustomer(customerId: string) {
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
    this.customerService.getCustomerDetails(customerId, this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedMappingId = response.data;
          this.selectedCustomer = response.data;
          this.edit.emit(response.data);
        }
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
      },
    });
  }

  getLspMapping(id: string) {
    this.lspMappingService.getLspMappingDetails(id).subscribe({
      next: (response) => {
        if (response) {
          this.selectedMappingId = response.data;
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedCustomer = null;
      this.selectedMappingId = null
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
      if(customer.lspMappingId){
        this.getLspMapping(customer.lspMappingId);
      }else{
        this.getCustomer(customer.customerId)
      }
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

  customerDetail(event: Event, customerId: string) {
    event.preventDefault();
    const modalElement = document.getElementById('customerDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCustomer(customerId);
    }
  }

  getcustomerCount() {
    this.customerService.customerCount().subscribe({
      next: (response) => {
        if (response && response.data) {
          const mergedData: any[] = [];
          this.customerCard.forEach(meta => {
            const matchedItem = response.data.find((item: any) => item.name.includes(meta.name));
            mergedData.push({
              name: meta.name,
              icon: meta.icon,
              color: meta.color,
              progress: meta.progress,
              headerColor: meta.headerColor,
              count: matchedItem ? matchedItem.count : 0,
            });
          });
          this.customerCount = mergedData;
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    })
  }

  downloadCustomer() {
    this.customerService.downloadCustomerList(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.exportService.exportToExcel(response.data);
        }
      }
    });
  }

    ngOnDestroy(): void {
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
  }
}
