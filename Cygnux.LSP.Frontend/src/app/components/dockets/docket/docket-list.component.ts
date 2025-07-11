import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { DocketResponse } from '../../../shared/models/docket.model';
import { CommonService } from '../../../shared/services/common.service';
import { DocketService } from '../../../shared/services/docket.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { IdentityService } from '../../../shared/services/identity.service';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { ToastrService } from 'ngx-toastr';
import feather from 'feather-icons';
import { ImportDocketComponent } from './import-docket/import-docket.component';
import { AddDocketComponent } from './add-docket/add-docket.component';
import { PodStatusUploadComponent } from './pod-status-upload/pod-status-upload.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ExportService } from '../../../shared/services/export.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docket',
  standalone: false,
  templateUrl: './docket-list.component.html',
  styleUrls: ['./docket-list.component.scss'],
  providers: [BsModalService]
})
export class DocketListComponent implements OnInit {
  public dockets: DocketResponse[] = [];
  public selectedDocket: DocketResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public selectedFile: File | null = null;
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!: Subscription;
  public isSelected: string = '';
  public loading: boolean = false;
  public modalRef!: BsModalRef;
  public hoveredRow: number | null = null;
  public userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  public isLoadingDocketList:boolean = false;
  @Output() edit = new EventEmitter<DocketResponse>();
  @ViewChild(ImportDocketComponent) ImportDocketComponent!: ImportDocketComponent;
  @ViewChild(AddDocketComponent) addDocketComponent!: AddDocketComponent;
  @ViewChild('PodStatusUpload') PodStatusUpload!: PodStatusUploadComponent;
  constructor(
    public docketService: DocketService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private sweetAlertService: SweetAlertService,
    private identityService: IdentityService,
    private cdRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private exportService: ExportService,

  ) {
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Docket');

  }

  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    this.commonService.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.getDockets();
    if (this.RoleListsubscribe) { this.RoleListsubscribe.unsubscribe() }
      this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res) => {
        if (res) {
          this.commonService.menuRoleList = res;
        }
      });
  }

  getDockets(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    this.commonService.updateLoader(true);
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
    };
    this.docketService.getDocketList(this.identityService.getLoggedUserId(), filters).subscribe({
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
        this.sweetAlertService.error(
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
    this.docketService.importDocket(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response);
      },
    });
  }

  deleteDocket(docketCode?: any) {
    this.docketService.deleteDocket(docketCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getDockets();
        this.closeDeleteModal();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

    docketCancel(docketCode?: any) {
    this.docketService.docketCancel(docketCode,this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getDockets();
        this.closeDeleteModal();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

   docketReject(docketCode?: any ,remarks?:any) {
    const payload = {
      id: docketCode,
      userId: this.identityService.getLoggedUserId(),
      remarks: remarks
    };
    this.docketService.docketReject(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getDockets();
        this.closeDeleteModal();
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  editModal(event: Event, docketList: any, type: string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.isSelected = type;
      this.getDocket(docketList);
    }
  }

    deleteModal(docketCode: string ,data:any) {
      const isLsp = this.userRoles === 'LSP Admin';
      if(data.isCustomerCancelled || data.isLSPCancelled){
          this.sweetAlertService.confirm("Are you sure to cancel docket?", 
            {confirmButtonText: "Approve",cancelButtonText: "Reject"}).then((result: any) => {
            if (result.isConfirmed) {
              this.docketCancel(docketCode);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.rejectionRemarks().then((remarks) => {
                if (remarks !== null) {
                  this.docketReject(docketCode, remarks);
                }
              });
            }
          });
      }else{
        const message = isLsp ? "Do you want to send docket cancel request to Customer for approval?" : "Do you want to send docket cancel request to LSP for approval?";
        this.sweetAlertService.confirm(message, {confirmButtonText: "Yes",cancelButtonText: "No"}).then((result: any) => {
          if (result.isConfirmed) {
            this.docketCancel(docketCode);
          } else {
            this.deleteDocket(docketCode);
          }
        });
      }
    }

  rejectionRemarks(): Promise<string | null> {
    return Swal.fire({
      title: 'Reject Docket',
      html: `<div style="text-align: left;">
      <label for="remarks" style="font-weight: 500; margin-bottom: 6px; display: block;">
        Please provide a reason for rejection:
      </label>
      <textarea id="remarks" class="swal2-textarea w-100" placeholder="Type your remarks here..."
        style="min-height: 120px; resize: vertical; font-size: 14px; padding: 8px; margin: 0;"></textarea></div>`,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      focusConfirm: false,
      didOpen: () => {
        const remarksInput = document.getElementById('remarks') as HTMLTextAreaElement;
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn && remarksInput) {
          confirmBtn.setAttribute('disabled', 'true');
          remarksInput.addEventListener('input', () => {
            if (remarksInput.value.trim().length > 0) {
              confirmBtn.removeAttribute('disabled');
            } else {
              confirmBtn.setAttribute('disabled', 'true');
            }
          });
        }
      },
      preConfirm: () => {
        return (document.getElementById('remarks') as HTMLTextAreaElement).value.trim();
      }
    }).then((result) => {
      return result.isConfirmed ? result.value : null;
    });
  }

  openImportModal(event: Event) {
    event.preventDefault();
    const modalElement = document.getElementById('importModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
          modal.hide();
          modalElement.removeEventListener('click', handleOutsideClick);
          this.ImportDocketComponent.onClose();
        }
      };
      modalElement.addEventListener('click', handleOutsideClick);
    }
  }

  openUploadModal(event: Event) {
    event.preventDefault();
    const modalElement = document.getElementById('uploadModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  getDocket(docketList: any) {
    this.docketService.getDocketDetails(docketList.docketId).subscribe({
      next: (response) => {
        if (response) {
          this.selectedDocket = response.data;
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
    
    if (this.addDocketComponent.isCustomerOrLspEmpty()) {
      this.sweetAlertService.info("LSP mapping is missing for this customer. Please contact the administrator");
      return;
    }

    if (modalElement) {
      const modal = new Modal(modalElement);
      this.selectedDocket = null;
      modal.show();
      const handleOutsideClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('modal')) {
          modal.hide();
          modalElement.removeEventListener('click', handleOutsideClick);
          this.addDocketComponent.onClose();
        }
      };
      modalElement.addEventListener('click', handleOutsideClick);
    }
  }

  openPOD(Templatepod: TemplateRef<any>, data: any) {
    this.getDocket(data);
    this.modalRef = this.modalService.show(Templatepod, { class: 'modal-lg modal-dialog-centered', backdrop: true });
  }

  downloadPod(pod: any): void {
    if (!pod?.podLink) {
      console.error('No image link found.');
      return;
    }

    // Force HTTPS in case backend returns HTTP
    const secureUrl = pod.podLink.startsWith('http://')
      ? pod.podLink.replace('http://', 'https://')
      : pod.podLink;

    fetch(secureUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.extractFileName(secureUrl); // Use cleaned URL
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up
      })
      .catch(error => {
        console.error('Image download failed:', error);
        alert('Failed to download image. Please try again or check the image URL.');
      });
  }

  extractFileName(url: string): string {
    try {
      const path = url.split('?')[0]; // Remove query params
      const filename = path.substring(path.lastIndexOf('/') + 1);
      return filename || `downloaded_image_${Date.now()}.jpg`;
    } catch {
      return `downloaded_image_${Date.now()}.jpg`;
    }
  }

  closeDeleteModal() {
    const modalElement: any = document.getElementById('deleteModal');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  closeEditModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      this.getDockets();
    }
  }

  closeImportModal() {
    const modalElement: any = document.getElementById('importModal');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      this.getDockets();
    }
  }

  closeUploadModal() {
    const modalElement: any = document.getElementById('uploadModal');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      this.getDockets();
    }
  }

  closestatusupdateModal() {
    const modalElement: any = document.getElementById('showModal');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      this.getDockets();
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.getDockets(this.page);
  }

  docketDetail(event: Event, docketList: any, type: string) {
    event.preventDefault();
    const modalElement = document.getElementById('docketDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.isSelected = type;
      // this.selectedDocket = docketList;
      this.getDocket(docketList);
    }
  }

  openStatusUpdateModal(docketData: any, type: string) {
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      // this.selectedDocket=docketData
      this.isSelected = type;
      this.getDocket(docketData);
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openPodUpdateModal(data: any) {
    const editSubscription = this.edit.subscribe((docket: any) => {
      this.PodStatusUpload.showPopup(docket);
      editSubscription.unsubscribe();
    });
    this.getDocket(data);
  }

  downloadDocketList() {
      this.isLoadingDocketList = true;
    this.docketService.downloadDocketData(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        this.isLoadingDocketList = false;
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
