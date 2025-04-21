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
import { CustomerService } from '../../../shared/services/customer.service';
import { LspResponse } from '../../../shared/models/lsp.model';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspTatResponse } from '../../../shared/models/lsp-tat.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { TrackingListResponse } from '../../../shared/models/docket.model';
import { DocketService } from '../../../shared/services/docket.service';

@Component({
  selector: 'app-add-lsp-tat',
  standalone: false,
  templateUrl: './add-lsp-tat.component.html',
  styleUrls: ['./add-lsp-tat.component.scss'],
})
export class AddLspTatComponent implements OnInit, OnChanges {
  public lspTatForm!: FormGroup;
  public lspTatId: string = '';
  public lsps: LspResponse[] | null = null;
  public customers: CustomerResponse[] | null = null;
  public transporter:TrackingListResponse[]=[];
  @Input() lspTatResponse: LspTatResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private lspTatService: LspMappingService,
    private commonService: CommonService,
    private sweetAlertService: SweetAlertService,
    private docketService :DocketService
  ) {
    this.lspTatForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspTatResponse'] && this.lspTatResponse) {
      this.lspTatForm.patchValue(this.lspTatResponse);
      this.lspTatId = this.lspTatResponse.lspTatId;
    } else {
      this.lspTatForm.reset();
      this.lspTatId = '';
    }
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getLsps();
    this.buildForm();
    this.getTransporterDetail();
  }

  buildForm(): void {
    this.lspTatForm = new FormGroup({
      lspId: new FormControl(null, [Validators.required]),
      customerId: new FormControl(null, [Validators.required]),
      product: new FormControl(null, [Validators.required]),
      origin: new FormControl(null, [Validators.required]),
      destination: new FormControl(null, [Validators.required]),
      destinationState: new FormControl(null, [Validators.required]),
      mode: new FormControl(null, [Validators.required]),
      tat: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      bookingType: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
      createdBy:new FormControl(''),
      userId:new FormControl(''),
      updatedBy:new FormControl('')
    });
  }

  getTransporterDetail(){
    this.docketService.getTrackingList('TRN').subscribe({
      next: (response) => {
        if (response.success) {
          this.transporter=response.data;
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  getCustomers() {
    this.commonService.updateLoader(true);
    this.lspTatService.getCustomers().subscribe({
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
  getLsps() {
    this.commonService.updateLoader(true);
    this.lspTatService.getLsps().subscribe({
      next: (response) => {
        if (response) {
          this.lsps = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  onSubmitLspTat(form: FormGroup): void {
    if (form.valid) {
      !this.lspTatId ? this.addLspTat(form) : this.updateLspTat(form);
    }
  }

  addLspTat(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.lspTatService.addLspTat(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspTatForm.reset();
          this.buildForm()
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  updateLspTat(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.lspTatService
      .updateLspTat(this.lspTatId, form.getRawValue())
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sweetAlertService.success(response.data.message);
            this.dataEmitter.emit();
            this.lspTatForm.reset();
          } else {
            this.sweetAlertService.error(response.error.message);
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
