import {AfterViewInit, Component,EventEmitter,OnInit, Output} from '@angular/core';
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
  filters: { [key: string]: string } = {}; // Dynamic filter object
  RoleListsubscribe!:Subscription;
  @Output() edit = new EventEmitter<DocketResponse>();
  constructor(
    public docketService: DocketService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private sweetAlertService:SweetAlertService,
    private identityService:IdentityService,
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Docket');
  }
  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
  }
  ngOnInit(): void {
    this.getDockets();
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res)=>{
      if (res) { 
        this.commonService.menuRoleList = res;
        console.log("Updated from activemenuRoleList:", res);
      }
     });
    // this.route.paramMap.subscribe(params => {
    //   const navigationState = history.state;
    //   if (navigationState && navigationState.start) {
    //     this.commonService.menuRoleList = navigationState.start;
    //     console.log(this.commonService.menuRoleList)
    //   }
    // });
  }

  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
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

  openImportModal(event: Event){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('importModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
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

  openStatusUpdateModal(){
    const modalElement = document.getElementById('showModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
