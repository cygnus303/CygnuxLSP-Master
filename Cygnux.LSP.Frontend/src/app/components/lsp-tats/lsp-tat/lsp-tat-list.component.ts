import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Modal } from 'bootstrap';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';
import { LspTatResponse } from '../../../shared/models/lsp-tat.model';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { AddLspTatComponent } from '../add-lsp-tat/add-lsp-tat.component';
import { Router } from '@angular/router';
import { CountResponse } from '../../../shared/models/lsp.model';

@Component({
  selector: 'app-lsp-tat',
  standalone: false,
  templateUrl: './lsp-tat-list.component.html',
  styleUrls: ['./lsp-tat-list.component.scss'],
})
export class LspTatListComponent implements OnInit {
  public lspMappingId: string = '';
  public lspTats: LspTatResponse[] = [];
  public selectedLsp: LspTatResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!: Subscription;
  public loading: boolean = false;
  public hoveredRow: number | null = null;
  @Output() edit = new EventEmitter<LspMappingResponse>();
  @ViewChild(AddLspTatComponent) addLspTatComponent!: AddLspTatComponent;
  public lspTatCount: CountResponse[] = [];

  constructor(
    private lspMappingService: LspMappingService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private sweetAlertService: SweetAlertService,
    private identityService: IdentityService,
    private router: Router
  ) {
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('LSP Tat');
  }

     LSPTatCard = [
    { name: 'Total LSP Tat', color: 'red', icon: 'fa fa-hourglass-half', progress: "progress-gradient-danger", headerColor: 'header-text-danger', count:20},
    // { name: 'Customer Mapping', color: 'orange', icon: 'fa fa-link', progress: "progress-gradient-secondary", headerColor: 'header-text-secondary', count:20 },
    // { name: 'LSP Mapping', color: 'green', icon: 'fa fa-network-wired', progress: "progress-gradient-success", headerColor: 'header-text-success' , count:22 },
    { name: 'Active', color: 'blue', icon: 'fa fa-user-check', progress: "progress-gradient-primary", headerColor: 'header-text-primary' , count:20},
    { name: 'In-Active', color: 'purple', icon: 'fa fa-user-slash', progress: "progress-gradient-info", headerColor: 'header-text-info', count:20 },
  ];

  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getLspTatCount();
    this.getLspMappings();
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res) => {
      if (res) {
        this.commonService.menuRoleList = res;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
  }

  getLspMappings(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      UserID: this.identityService.getLoggedUserId(),
      PageSize: this.pageSize,
    };
    this.commonService.updateLoader(true);
    this.lspMappingService.getLspTatList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.lspTats = response.data;
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

  editModal(event: Event, id: string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.lspMappingId = id;
      this.getLspMapping(id);
    }
  }

  getDeleteLspTat(tatId: string) {
    this.lspMappingService.getDeleteLSPTatData(tatId).subscribe({
      next: (response) => {
        this.sweetAlertService.delete(
          'Are you sure you want to delete this LSP Tat?',
          () => this.deleteLspMappingTat(tatId)
        );
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
  deleteLspMappingTat(tatId: string) {
    this.lspMappingService.deleteLspMappingTat(tatId).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        // this.closeDeleteModal();
        this.getLspMappings();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
  getLspMapping(id: string) {
    this.lspMappingService.getLspTatDetails(id).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLsp = response.data;
          this.edit.emit();
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  closeEditModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      this.getLspMappings();
    }
  }
  openModal() {
    this.lspMappingService.getCustomers(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        const customers = response?.data || [];

        //  No customers found
        if (!customers || customers.length === 0) {
          const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');

          if (userRoles.includes('SA')) {
            this.sweetAlertService.info('LSP mapping is missing. Redirecting to LSP Mapping...', () => {
              this.router.navigate(['/lsp-mapping/list']);
            });
          }else {
            // Show info for non-SA users
            this.sweetAlertService.info('LSP mapping is missing for this customer. Please contact the administrator');
          }
          return;
        }

        // Customers found - Open modal
        const modalElement: any = document.getElementById('exampleModalLong');
        if (modalElement) {
          const modal = new Modal(modalElement);
          this.lspMappingId = '';
          this.selectedLsp = null;
          modal.show();

          const handleOutsideClick = (e: MouseEvent) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.classList.contains('modal')
            ) {
              modal.hide();
              modalElement.removeEventListener('click', handleOutsideClick);
              this.addLspTatComponent.onClose();
            }
          };

          modalElement.addEventListener('click', handleOutsideClick);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error('Failed to check customer availability.');
      },
    });
  }


   getLspTatCount() {
    this.lspMappingService.lspTatCount(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response && response.data) {
          const mergedData: any[] = [];
          this.LSPTatCard.forEach(meta => {
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
          this.lspTatCount = mergedData;
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    })
  }

  onPageChange(page: number) {
    this.page = page;
    this.getLspMappings(this.page);
  }

  lspTatsDetail(event: Event, lspTatId: string) {
    event.preventDefault();
    const modalElement = document.getElementById('lspTatsDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getLspMapping(lspTatId);
    }
  }
}
