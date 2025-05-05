import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from '../../../../shared/services/common.service';
import { IdentityService } from '../../../../shared/services/identity.service';
import { LspMappingService } from '../../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { CustomerResponse } from '../../../../shared/models/customer.model';

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
  public modalRef!: BsModalRef;
  @ViewChild('Templatepod', { static: true }) Templatepod!: TemplateRef<any>;
  constructor(private modalService: BsModalService,private commonService: CommonService,private identityService:IdentityService,private lspTatService: LspMappingService,private sweetAlertService: SweetAlertService){
    this.podUpdateForm = new FormGroup({
      docketNo : new FormControl(''),
       uploadDate : new FormControl(new Date()),
       pod : new FormControl(null),
       transportModeDesc:new FormControl(''),
       transporterDesc: new FormControl(''),
       customerId: new FormControl(''),
       bookingDate: new FormControl(''),
       statusDate: new FormControl(''),
       fromLocation: new FormControl(''),
       toLocation: new FormControl(''),
       quantity: new FormControl(''),
       invoiceNo: new FormControl(''),
       currentStatusDesc: new FormControl(''),
       Customer:new FormControl('')
    });
  this.getCustomers();
  }
showPopup(data:any){
  data.bookingDate = new Date(data.bookingDate)
  this.podUpdateForm.patchValue(data)
  this.modalRef = this.modalService.show(this.Templatepod, {  class: 'modal-lg modal-dialog-centered',backdrop: true });
}

getCustomers() {
  this.commonService.updateLoader(true);
  this.lspTatService.getCustomers(this.identityService.getLoggedUserId()).subscribe({
    next: (response) => {
      if (response) {
        this.customers = response.data;
      }
      this.commonService.updateLoader(false);
    },
    error: (response: any) => {
      this.sweetAlertService.error(response.error.message);
      this.commonService.updateLoader(false);
    },
  });
}
}
