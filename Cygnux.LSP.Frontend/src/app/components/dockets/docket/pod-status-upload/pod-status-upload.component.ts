import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../../shared/services/common.service';
import { IdentityService } from '../../../../shared/services/identity.service';
import { LspMappingService } from '../../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { CustomerResponse } from '../../../../shared/models/customer.model';
import { DocketService } from '../../../../shared/services/docket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'pod-status-upload',
  standalone: false,
  templateUrl: './pod-status-upload.component.html',
  styleUrl: './pod-status-upload.component.scss',
  providers:[BsModalService]
})
export class PodStatusUploadComponent {
  public podUpdateForm!:FormGroup;
  public customers: CustomerResponse[] = [];
  public selectedFile: File | null = null;
  public modalRef!: BsModalRef;
  @ViewChild('Templatepod', { static: true }) Templatepod!: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private identityService:IdentityService,
    private lspTatService: LspMappingService,
    private sweetAlertService: SweetAlertService,
    private docketService:DocketService,
    private toasterService:ToastrService
  ){
    this.buildForm();
    this.getCustomers();
  }

  buildForm(){
    this.podUpdateForm = new FormGroup({
      docketNo : new FormControl(''),
       uploadDate : new FormControl(new Date()),
       PODLink : new FormControl(null),
       transportModeDesc:new FormControl(''),
       transporterDesc: new FormControl(''),
       LspId: new FormControl(''),
       customerId: new FormControl(''),
       bookingDate: new FormControl(''),
       statusDate: new FormControl(''),
       fromLocation: new FormControl(''),
       toLocation: new FormControl(''),
       quantity: new FormControl(''),
       invoiceNo: new FormControl(''),
       currentStatusDesc: new FormControl(''),
       Customer:new FormControl(''),
       PODFileName:new FormControl('')
    });
  }

showPopup(data:any){
  data.bookingDate = new Date(data?.bookingDate)
  data.LspId=data.transporter;
  this.podUpdateForm.patchValue(data)
  
  this.modalRef = this.modalService.show(this.Templatepod, {  class: 'modal-lg modal-dialog-centered',backdrop: true });
}

getCustomers() {
  this.lspTatService.getCustomers(this.identityService.getLoggedUserId()).subscribe({
    next: (response) => {
      if (response) {
        this.customers = response.data;
      }
    },
    error: (response: any) => {
      this.sweetAlertService.error(response.error.message);
    },
  });
}

getDocket(docketList: any) {
    this.docketService.getDocketDetails(docketList.docketId).subscribe({
      next: (response) => {
        if (response) {
  this.podUpdateForm.patchValue(response.data)
        }
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
      },
    });
  }

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    // Optionally update the form control if needed
    this.podUpdateForm.patchValue({
      PODFileName: file.name
    });
  }
}

formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}


savePOD(): void {
  const formData = new FormData();
  const{transportModeDesc,
transporterDesc,
bookingDate,
statusDate,
fromLocation,
toLocation,
quantity,
invoiceNo,
currentStatusDesc,
Customer,...payload}=this.podUpdateForm.value

  formData.append('docpodJson',JSON.stringify(payload));

  if (this.selectedFile) {
    formData.append('imageFile', this.selectedFile, this.selectedFile.name);
  }

  this.docketService.singlePOD(this.podUpdateForm.value.docketNo,this.identityService.getLoggedUserId(), formData).subscribe({
    next: (response) => {
      if (response) {
        this.buildForm();
        this.modalRef.hide();
        this.sweetAlertService.success(response.data.message);
      }
    },
    error: (response: any) => {
      this.sweetAlertService.error(response.error.message);
    },
  });
}

}
