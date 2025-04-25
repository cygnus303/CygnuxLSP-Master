import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Modal } from 'bootstrap';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';
import { LspTatResponse } from '../../../shared/models/lsp-tat.model';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { IdentityService } from '../../../shared/services/identity.service';

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
  public RoleListsubscribe!:Subscription;
  @Output() edit = new EventEmitter<LspMappingResponse>();
  loading = false;

  constructor(
    private lspMappingService: LspMappingService,
    public commonService: CommonService,
    private toastrService: ToastrService,
    private sweetAlertService:SweetAlertService,
    private identityService : IdentityService
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Lsp Tat');
  }

  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getLspMappings();
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

  getLspMappings(page: number = 1) {
    this.commonService.updateLoader(true);
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    const filters: any = {
      ...this.filters,
      Page: page,
      UserID:this.identityService.getLoggedUserId(),
      PageSize: this.pageSize,
    };
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
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.lspMappingId = id;
      this.getLspMapping(id);
    }
  }
  deleteModal(event: Event, id: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.lspMappingId = id;
      modal.show();
    }
  }
  deleteLspMappingTat() {
    this.commonService.updateLoader(true);
    this.lspMappingService.deleteLspMappingTat(this.lspMappingId).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
        this.closeDeleteModal();
        this.getLspMappings();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  getLspMapping(id: string) {
    this.commonService.updateLoader(true);
    this.lspMappingService.getLspTatDetails(id,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLsp = response.data;
          this.edit.emit();
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

      this.getLspMappings();
    }
  }
  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement); // Using Bootstrap's JS modal method
      this.lspMappingId = '';
      this.selectedLsp = null;
      modal.show();
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getLspMappings(this.page);
  }

  lspTatsDetail(event: Event, lspTatId: string){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('lspTatsDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getLspMapping(lspTatId);
    }
  }
}
