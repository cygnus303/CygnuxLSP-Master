import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { DocketResponse } from '../../../shared/models/docket.model';
import { CommonService } from '../../../shared/services/common.service';
import { DocketService } from '../../../shared/services/docket.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@Component({
  selector: 'app-docket',
  standalone: false,
  templateUrl: './docket-list.component.html',
  styleUrls: ['./docket-list.component.scss'],
})
export class DocketListComponent implements OnInit, AfterViewInit {
  public dockets: DocketResponse[] = [];
  public docketCode: string = '';
  selectedDocket: DocketResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  selectedFile: File | null = null;
  @Output() edit = new EventEmitter<DocketResponse>();

  constructor(
    private docketService: DocketService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {defineElement(lottie.loadAnimation);}

  ngOnInit(): void {
    this.getDockets();
  }

  ngAfterViewInit(): void {}
  getDockets(page: number = 1) {
    this.commonService.updateLoader(true);
    this.docketService.getDocketList(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.dockets = response.data;
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
  // Handle file input change
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.ms-excel', // XLS
        'text/csv', // CSV
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12', // XLSB
        'application/vnd.ms-excel.sheet.macroEnabled.12', // XLSM
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template', // XLTX
        'application/vnd.ms-excel.template.macroEnabled.12', // XLTM
      ];
      if (validExcelTypes.includes(file.type)) {
        this.selectedFile = file;
        const formData = new FormData();
        formData.append('file', file);
        this.importDocket(formData);
      } else {
        this.toasterService.error(
          'Please upload a valid excel file (XLSX, XLS, or CSV).'
        );
        this.selectedFile = null;
      }
    }
  }
  triggerFileInput(event: Event): void {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  importDocket(dataToSubmit: any): void {
    this.commonService.updateLoader(true);
    this.docketService.importDocket(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  deleteDocket() {
    this.commonService.updateLoader(true);
    this.docketService.deleteDocket(this.docketCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.getDockets();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  editModal(event: Event, docketCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getDocket(docketCode);
    }
  }
  deleteModal(event: Event, docketCode: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.docketCode = docketCode;
      modal.show();
    }
  }
  getDocket(docketCode: string) {
    this.commonService.updateLoader(true);
    this.docketService.getDocketDetails(docketCode).subscribe({
      next: (response) => {
        if (response) {
          this.selectedDocket = response.data;
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
      this.selectedDocket = null;
      this.docketCode = '';
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

      this.getDockets();
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getDockets(this.page);
  }
}
