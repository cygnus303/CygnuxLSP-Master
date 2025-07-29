import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IdentityService } from '../../../../shared/services/identity.service';
import { LspMappingService } from '../../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { CustomerResponse } from '../../../../shared/models/customer.model';
import { DocketService } from '../../../../shared/services/docket.service';

@Component({
  selector: 'pod-status-upload',
  standalone: false,
  templateUrl: './pod-status-upload.component.html',
  styleUrl: './pod-status-upload.component.scss',
  providers:[BsModalService]
})
export class PodStatusUploadComponent {
[x: string]: any;
  public podImageUrl: string[] = [];
  public podUpdateForm!:FormGroup;
  public customers: CustomerResponse[] = [];
  public selectedFile:  File[] = [];
  public modalRef!: BsModalRef;
  public isLoading = false;
  @ViewChild('Templatepod', { static: true }) Templatepod!: TemplateRef<any>;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  
  constructor( private modalService: BsModalService,private identityService:IdentityService, private lspTatService: LspMappingService, private sweetAlertService: SweetAlertService, private docketService:DocketService){
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
  if(data){
    data.LspId = data?.transporter;
    data.bookingDate = new Date(data?.bookingDate)
    this.podUpdateForm.patchValue(data);
    this.podImageUrl = [];
    if (data?.podLink) {
      this.podImageUrl.push(data.podLink);
    }
    if (data?.podLinkBack) {
      this.podImageUrl.push(data.podLinkBack);
    }
    this.modalRef = this.modalService.show(this.Templatepod, {  class: 'modal-lg modal-dialog-centered',backdrop: true });
  }
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

isPodImageUrlsArray(): boolean {
  return Array.isArray(this.podImageUrl) && this.podImageUrl.length > 0;
}


// onFileSelected(event: any) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.podImageUrl = e.target.result;
//     };
//     reader.readAsDataURL(file);
//     this.selectedFile = file;
//     this.podUpdateForm.get('PODFileName')?.setValue(file.name);
//   }
// }
onFileSelected(event: any): void {
  const files: FileList = event.target.files;

  if (files && files.length > 0) {
    this.podImageUrl = [];
    this.selectedFile = [];

    Array.from(files).forEach((file: File) => {
      this.selectedFile.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.podImageUrl.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    // Optional: set the first file name in the form control
    this.podUpdateForm.get('PODFileName')?.setValue(this.selectedFile[0].name);
  }
}

onSavePOD(): void {
  this.isLoading = true;
  const formData = new FormData();
  const{transportModeDesc,transporterDesc, bookingDate,statusDate,fromLocation,toLocation,quantity,invoiceNo,currentStatusDesc,Customer,...payload} = this.podUpdateForm.value
  formData.append('docpodJson',JSON.stringify(payload));
   formData.append('docketNo',this.podUpdateForm.value.docketNo);
   formData.append('lspuser',this.identityService.getLoggedUserId());
  if (this.selectedFile) {
    this.selectedFile.forEach((file, index) => {
    formData.append(`imageFiles`, file, file.name); // `imageFiles` key can be plural
  });
  }
  this.docketService.singlePOD(formData).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response) {
        this.buildForm();
        this.modalRef.hide();
        this.dataEmitter.emit();
        this.sweetAlertService.success(response.data.message);
      }
    },
    error: (response: any) => {
      this.isLoading = false;
      this.sweetAlertService.error(response.error.message);
    },
  });
}

}
