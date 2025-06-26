import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Modal } from 'bootstrap';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { AddLspMappingComponent } from '../add-lsp-mapping/add-lsp-mapping.component';

@Component({
  selector: 'app-lsp-mapping',
  standalone: false,
  templateUrl: './lsp-mapping-list.component.html',
  styleUrls: ['./lsp-mapping-list.component.scss'],
})
export class LspMappingListComponent implements OnInit {
  public lspMappingId: string = '';
  public lspMappings: LspMappingResponse[] = [];
  public selectedLsp: LspMappingResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!: Subscription;
  public loading: boolean = false;
  hoveredRow: number | null = null;
  @Output() edit = new EventEmitter<LspMappingResponse>();
  @ViewChild(AddLspMappingComponent) addLspMappingComponent!: AddLspMappingComponent;

  constructor(
    private lspMappingService: LspMappingService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private sweetAlertService: SweetAlertService,
    private identityService: IdentityService,
  ) {
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('LSP Mapping');
  }

  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
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
      PageSize: this.pageSize,
    };
    this.commonService.updateLoader(true);
    this.lspMappingService.getLspMappingList(this.identityService.getLoggedUserId(), filters).subscribe({
      next: (response) => {
        if (response) {
          this.lspMappings = response.data;
          this.lspMappings = response.data.map((item: any) => ({
            ...item,
            lspResponses: item.lspName.split(',').map((name: string, index: number) => ({
              lspName: name.trim(),
              lspId: item.lspId.split(',')[index]?.trim() || ''
            }))
          }));

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

  getDeleteLspmapping(lspmappingId: string) {
    this.lspMappingService.getDeleteLSPMappingData(lspmappingId).subscribe({
      next: (response) => {
        this.sweetAlertService.delete(
          'Are you sure you want to delete this LSP Mapping?',
          () => this.deleteLspMapping(lspmappingId)
        );
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  deleteLspMapping(lspmappingId: string) {
    this.lspMappingService.deleteLspMapping(lspmappingId).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getLspMappings();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  editModal(event: Event, id: string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedLsp = null;
      this.getLspMapping(id);
      this.lspMappingId = id;
    }
  }

  getLspMapping(id: string) {
    this.lspMappingService.getLspMappingDetails(id).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLsp = response.data;
          this.edit.emit(response.data);
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
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.lspMappingId = '';
      this.selectedLsp = null;
      modal.show();
      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
          modal.hide();
          modalElement.removeEventListener('click', handleOutsideClick);
          this.addLspMappingComponent.onClose();
        }
      };
      modalElement.addEventListener('click', handleOutsideClick);
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getLspMappings(this.page);
  }

  lspMappingsDetail(event: Event, lsp: any) {
    event.preventDefault();
    const modalElement = document.getElementById('lspMappingsDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.selectedLsp = lsp;
      // this.getLspMapping(customerId);
    }
  }
}
