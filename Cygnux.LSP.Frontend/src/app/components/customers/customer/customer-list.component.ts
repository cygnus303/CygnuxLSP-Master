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
          this.commonService.updateLoader(false);
        }
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);

      },
    });
  }

// mappingCustomer(event: Event,customerId:string){
// event.preventDefault();
//     const modalElement = document.getElementById('checkDeleteModal');
//     if (modalElement) {
//       const modal = new Modal(modalElement);
//       this.customerId = customerId;
//       modal.show();
//     }
// }

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

        //   const tableHtml = `<div style="font-size: 15px; text-align: center;">
        //               <div style="margin-bottom: 12px; font-weight: 500;">
        //                 ⚠️ This customer is currently mapped.<br>Are you sure you want to delete?
        //               </div>
        //               <div style="display: flex; justify-content: center;">
        //                 <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; border-radius: 5px; width: 100%;">
        //                   <table style="width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed;">
        //                     <thead style="position: sticky; top: 0; background-color: #f2f2f2; z-index: 1;">
        //                       <tr>
        //                         <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">LSP Name</th>
        //                         <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Docket No</th>
        //                         <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Origin</th>
        //                         <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Destination</th>
        //                       </tr>
        //                     </thead>
        //                     <tbody>
        //                       ${response.data.map((item: any) => `
        //                         <tr>
        //                           <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.lspName || '-'}</td>
        //                           <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.docketNo || '-'}</td>
        //                           <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.origin || '-'}</td>
        //                           <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.destination || '-'}</td>
        //                         </tr>
        //                       `).join('')}
        //                     </tbody>
        //                   </table>
        //                 </div>
        //               </div>
        //             </div>`;
        //       Swal.fire({
        //         html: tableHtml,
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonText: 'Yes, Delete',
        //         cancelButtonText: 'Cancel',
        //         width: 700,
        //         customClass: {
        //           popup: 'animated fadeIn',
        //           confirmButton: 'swal2-confirm btn btn-danger',
        //           cancelButton: 'swal2-cancel btn btn-secondary'
        //         },
        //         buttonsStyling: false
        //       }).then((result) => {
        //         if (result.isConfirmed) {
        //           this.deleteCustomer(customerId);
        //         }
        //       });
        // }
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
        // this.closeDeleteModal();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  editModal(event: Event, customerCode: string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.customerCode = customerCode;
      this.getCustomer(customerCode);
    }
  }
  // deleteModal(event: Event, customerId: string) {
  //   event.preventDefault();
  //   const modalElement = document.getElementById('deleteModal');
  //   if (modalElement) {
  //     const modal = new Modal(modalElement);
  //     this.customerId = customerId;
  //     modal.show();
  //   }
  // }
  getCustomer(customerCode: string) {
    this.customerService.getCustomerDetails(customerCode,this.identityService.getLoggedUserId()).subscribe({
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
  // closeDeleteModal() {
  //   const modalElement: any = document.getElementById('deleteModal');
  //   const modalInstance = Modal.getInstance(modalElement);
  //   if (modalInstance) {
  //     modalInstance.hide();
  //   }
  // }
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
      this.getCustomer(customer.customerCode);
      modal.show();
    }
  }
  closelspMappingModal() {
    const modalElement: any = document.getElementById('exampleModalLspMapping');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      // this.getCustomers(this.page);
    }
  }

  customerDetail(event: Event, customerCode: string){
    event.preventDefault();
    const modalElement = document.getElementById('customerDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getCustomer(customerCode);
    }
  }
  
  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }
}
