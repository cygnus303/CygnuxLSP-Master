import {ChangeDetectorRef, Component,EventEmitter,OnInit, Output, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-docket',
  standalone: false,
  templateUrl: './docket-list.component.html',
  styleUrls: ['./docket-list.component.scss'],
 
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
  public isSelected: string='';
  public loading : boolean = false;
  userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  @Output() edit = new EventEmitter<DocketResponse>();
  @ViewChild(ImportDocketComponent) ImportDocketComponent!: ImportDocketComponent;
  @ViewChild(AddDocketComponent) addDocketComponent!: AddDocketComponent;
  @ViewChild('PodStatusUpload') PodStatusUpload!: PodStatusUploadComponent;
  constructor(
    public docketService: DocketService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private sweetAlertService:SweetAlertService,
    private identityService:IdentityService,
    private cdRef: ChangeDetectorRef,
    
  ) {defineElement(lottie.loadAnimation);
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
    };
    this.docketService.getDocketList(this.identityService.getLoggedUserId(),filters).subscribe({
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

  deleteDocket(docketCode?:any) {
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

  editModal(event: Event, docketList: any,type:string) {
    event.preventDefault();
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.isSelected = type;
      this.getDocket(docketList);
    }
  }
  deleteModal(event: Event, docketCode: string) {
    event.preventDefault();
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
    if (modalElement) {
      const modal = new Modal(modalElement);
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

  closeUploadModal(){
    const modalElement: any = document.getElementById('uploadModal');
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      this.getDockets();
    }
  } 

  closestatusupdateModal(){
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

  docketDetail(event: Event, docketList: any ,type:string){
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

  openStatusUpdateModal(docketData:any ,type:string){
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
  this.getDocket(data);

  setTimeout(() => {
    this.PodStatusUpload.showPopup(this.selectedDocket);
  }, 100);  // delay of 100 ms
}



  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }
}
