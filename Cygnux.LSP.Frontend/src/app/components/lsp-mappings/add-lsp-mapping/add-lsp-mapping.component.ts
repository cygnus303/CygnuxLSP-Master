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
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';
import { CustomerService } from '../../../shared/services/customer.service';
import { LspResponse } from '../../../shared/models/lsp.model';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';

@Component({
  selector: 'app-add-lsp-mapping',
  standalone: false,
  templateUrl: './add-lsp-mapping.component.html',
  styleUrls: ['./add-lsp-mapping.component.scss'],
})
export class AddLspMappingComponent implements OnInit, OnChanges {
  public lspMappingForm!: FormGroup;
  public lspMappingId: string = '';
  @Input() lspMappingResponse: LspMappingResponse | null = null;
  lsps: LspResponse[] = [];
  customers: CustomerResponse[] | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private lspService: LspService,
    private customerService: CustomerService,
    private lspMappingService: LspMappingService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {
    this.lspMappingForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspMappingResponse'] && this.lspMappingResponse) {
      this.lspMappingResponse.lspIds = this.lspMappingResponse.lspResponses.map(
        (lsp) => lsp.lspId
      );
      this.lspMappingForm.patchValue(this.lspMappingResponse);
      this.lspMappingId = this.lspMappingResponse.customerId;
    } else {
      this.lspMappingForm.reset();
      this.lspMappingId = '';
    }
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getLsps();
    this.buildForm();
  }

  buildForm(): void {
    this.lspMappingForm = new FormGroup({
      lspIds: new FormControl([], [Validators.required]),
      customerId: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
    });
  }

  getCustomers() {
    this.commonService.updateLoader(true);
    this.customerService.getCustomerList().subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  getLsps() {
    this.commonService.updateLoader(true);
    this.lspService.getLspList().subscribe({
      next: (response) => {
        if (response) {
          this.lsps = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  onSubmitLspMapping(form: FormGroup): void {
    if (form.valid) {
      !this.lspMappingId
        ? this.addLspMapping(form)
        : this.updateLspMapping(form);
    }
  }

  addLspMapping(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.lspMappingService.addLspMapping(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspMappingForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  updateLspMapping(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.lspMappingService
      .updateLspMapping(this.lspMappingId, form.getRawValue())
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.success(response.data.message);
            this.dataEmitter.emit();
            this.lspMappingForm.reset();
          } else {
            this.toasterService.error(response.error.message);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.toasterService.error(response.error.message);
          this.commonService.updateLoader(false);
        },
      });
  }
}
