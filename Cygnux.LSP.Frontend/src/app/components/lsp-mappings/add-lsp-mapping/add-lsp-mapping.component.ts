import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LspService } from '../../../shared/services/lsp.service';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';
import { CustomerService } from '../../../shared/services/customer.service';
import { LspResponse } from '../../../shared/models/lsp.model';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { EmailRegex } from '../../../shared/constants/common';

@Component({
  selector: 'app-add-lsp-mapping',
  standalone: false,
  templateUrl: './add-lsp-mapping.component.html',
  styleUrls: ['./add-lsp-mapping.component.scss'],
})
export class AddLspMappingComponent implements OnInit, OnChanges {
  public lspMappingForm!: FormGroup;
  public lspMappingId: string = '';
  public lsps: LspResponse[] = [];
  public customers: CustomerResponse[] | null = null;
  public lspMappingsList :LspMappingResponse[] = [];
  @Input() lspMappingResponse: LspMappingResponse | null = null;
  @Input() type: string = '';
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private lspService: LspService,
    private customerService: CustomerService,
    private lspMappingService: LspMappingService,
    private sweetAlertService: SweetAlertService,
    private identityService:IdentityService
  ) {
    this.lspMappingForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspMappingResponse'] && this.lspMappingResponse) {
      this.lspMappingResponse.lspIds = this.lspMappingResponse.lspId
      ? this.lspMappingResponse.lspId.split(',').map(id => id.trim())
      : [];    
      this.lspMappingForm.patchValue(this.lspMappingResponse);
      this.lspMappingId = this.lspMappingResponse.lspMappingId ?? '';  
    } else {
      this.lspMappingForm.reset();
      this.buildForm();
      this.lspMappingId = '';
    }
    this.getLspMappings();
    this.getCustomers();
    this.customers = [];  
  }

  ngOnInit(): void {
    this.getLsps();
    this.buildForm();
  }

  buildForm(): void {
    this.lspMappingForm = new FormGroup({
      lspIds: new FormControl([], [Validators.required]),
      customerId: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
      supportEmail:new FormControl('', [Validators.pattern(EmailRegex)])
    });
  }

  getCustomers() {
    const filters: any = {
      Page: 1,
      PageSize: 100,
    };
    this.customerService.getCustomerList(this.identityService.getLoggedUserId(),filters).subscribe({
      next: (response) => {
        if (response) {
          if(!this.lspMappingResponse ){
              const mappedCustomerIds = this.lspMappingsList.map(elm => elm.customerId);
            //  this.customers = response.data.filter(res => !mappedCustomerIds.includes(res.customerId) && res.isActive);
             this.customers = response.data.filter(res => !mappedCustomerIds.includes(res.customerId));
          }else{
            // this.customers = response.data.filter((customer: any) => customer.isActive);
            this.customers = response.data;
          }
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
  
  getLspMappings(page: number = 1) {
    const filters: any = {
      Page: 1,
      PageSize: 500,
    };
    this.lspMappingService.getLspMappingList(this.identityService.getLoggedUserId(),filters).subscribe({
      next: (response) => {
        if (response) {
          this.lspMappingsList = response.data;
        }
      }
    });
  }

  getLsps() {
    const filters: any = {
      Page: 1,
      PageSize: 100,
    };
    this.lspService.getLspList(this.identityService.getLoggedUserId(),filters).subscribe({
      next: (response) => {
        if (response) {
        //  this.lsps = response.data.filter((lsp: any) => lsp.isActive);
         this.lsps = response.data;
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
  onSubmitLspMapping(form: FormGroup): void {
    if (form.valid) {
      const dataSubmit={
        ...form.value,
        LspId: form.value.lspIds?.join(',') || '',
        UserId:this.identityService.getLoggedUserId(),
        updatedBy:this.identityService.getLoggedUserId(),
        CreatedBy:this.identityService.getLoggedUserId()
      }
      delete dataSubmit.lspIds;
      !this.lspMappingId
        ? this.addLspMapping(dataSubmit)
        : this.updateLspMapping(dataSubmit);
    }else{
      form.markAllAsTouched();
    }
  }

  addLspMapping(dataSubmit: any): void {
    this.lspMappingService.addLspMapping(dataSubmit).subscribe({
      next: (response) => {
        if (response.data.status.toString() === '1') {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspMappingForm.reset();
          this.buildForm();
        } else {
          this.sweetAlertService.error(response.data.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.data.message);
      },
    });
  }

  updateLspMapping(dataSubmit: any): void {
    this.lspMappingService
      .updateLspMapping(this.lspMappingResponse?.lspMappingId,dataSubmit)
      .subscribe({
        next: (response) => {
          this.sweetAlertService.success(response.data.message);
          if (response.data.status.toString() === '1') {
            this.dataEmitter.emit();
            this.lspMappingForm.reset();
          } else {
            this.sweetAlertService.error(response.data.message);
          }
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.data.message);
        },
      });
  }

  onClose(){
    this.buildForm();
  }
}
