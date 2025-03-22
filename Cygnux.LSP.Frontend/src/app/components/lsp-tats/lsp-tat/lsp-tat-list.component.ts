import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';
import { LspTatResponse } from '../../../shared/models/lsp-tat.model';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@Component({
  selector: 'app-lsp-tat',
  standalone: false,
  templateUrl: './lsp-tat-list.component.html',
  styleUrls: ['./lsp-tat-list.component.scss'],
})
export class LspTatListComponent implements OnInit {
  public lspMappingId: string = '';
  public lspTats: LspTatResponse[] = [];
  selectedLsp: LspTatResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  @Output() edit = new EventEmitter<LspMappingResponse>();

  constructor(
    private lspMappingService: LspMappingService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.getLspMappings();
  }

  getLspMappings(page: number = 1) {
    this.commonService.updateLoader(true);
    this.lspMappingService.getLspTatList(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.lspTats = response.data;
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

  editModal(event: Event, id: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
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
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
        this.closeDeleteModal();
        this.getLspMappings();
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  getLspMapping(id: string) {
    this.commonService.updateLoader(true);
    this.lspMappingService.getLspTatDetails(id).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLsp = response.data;
          this.edit.emit();
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
}
