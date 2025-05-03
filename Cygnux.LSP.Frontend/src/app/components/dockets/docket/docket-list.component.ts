import {ChangeDetectorRef, Component,EventEmitter,OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-docket',
  standalone: false,
  templateUrl: './docket-list.component.html',
  styleUrls: ['./docket-list.component.scss'],
  providers:[BsModalService]
})
export class DocketListComponent implements OnInit {
  public dockets: DocketResponse[] = [];
  public docketCode: string = '';
  public selectedDocket: DocketResponse | null = null;
  public page = 1; // Current page number
  public pageSize = 5; // Number of items per page
  public totalItems = 0; // Total number of items
  public selectedFile: File | null = null;
  public filters: { [key: string]: string } = {}; // Dynamic filter object
  public RoleListsubscribe!:Subscription;
  public loading : boolean = false;
  public modalRef!: BsModalRef;
  podUpdateForm!:FormGroup;
  @Output() edit = new EventEmitter<DocketResponse>();
  @ViewChild(ImportDocketComponent) ImportDocketComponent!: ImportDocketComponent;
  @ViewChild(AddDocketComponent) addDocketComponent!: AddDocketComponent;
  @ViewChild('Templatepod', { static: true }) Templatepod!: TemplateRef<any>;
  constructor(
    public docketService: DocketService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private sweetAlertService:SweetAlertService,
    private identityService:IdentityService,
    private cdRef: ChangeDetectorRef,
    private modalService: BsModalService
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Docket');
    this.podUpdateForm = new FormGroup({
      docketNo : new FormControl(''),
       uploadDate : new FormControl(new Date()),
       pod : new FormControl(null),
    });
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
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res)=>{
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
      UserID:this.identityService.getLoggedUserId()
    };
    this.docketService.getDocketList(filters).subscribe({
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
    this.commonService.updateLoader(true);
    this.docketService.importDocket(dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response);
        this.commonService.updateLoader(false);
      },
    });
  }

  deleteDocket(docketCode?:any) {
    this.commonService.updateLoader(true);
    this.docketService.deleteDocket(docketCode).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.getDockets();
        this.closeDeleteModal();

        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
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

  openUploadModal(event: Event){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('uploadModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  getDocket(docketCode: string) {
    this.commonService.updateLoader(true);
    this.docketService.getDocketDetails(docketCode,this.identityService.getLoggedUserId()).subscribe({
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

  closeImportModal() {
    const modalElement: any = document.getElementById('importModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getDockets();
    }
  }

  closeUploadModal(){
    const modalElement: any = document.getElementById('uploadModal');
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

  docketDetail(event: Event, id: string){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('docketDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getDocket(id);
    }
  }

  openStatusUpdateModal(docketData:any){
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      this.selectedDocket=docketData
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openPodUpdateModal(data:any){
    debugger
    this.podUpdateForm.patchValue(data)
    this.modalRef = this.modalService.show(this.Templatepod, {  class: 'modal-lg modal-dialog-centered',backdrop: true });
  }

  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }
}
