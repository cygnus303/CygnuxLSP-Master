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
import { LspResponse } from '../../../shared/models/lsp.model';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { LspTatResponse } from '../../../shared/models/lsp-tat.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { TrackingListResponse } from '../../../shared/models/docket.model';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';

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
  public priority:TrackingListResponse[]=[];
  @Input() lspTatResponse: LspTatResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();
  userRoles = JSON.parse(localStorage.getItem('roles') || '[]');

  constructor(
    private lspTatService: LspMappingService,
    private sweetAlertService: SweetAlertService,
    private docketService :DocketService,
    private identityService:IdentityService
  ) {
    this.lspTatForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspTatResponse'] && this.lspTatResponse) {
      this.getLsps(this.lspTatResponse.customerId);
      this.lspTatId = this.lspTatResponse.lspTatId;
      this.lspTatForm.patchValue({
        ...this.lspTatResponse,
        priority:this.lspTatResponse.priority.toString()
      });
    } else {
      this.lspTatForm.reset();
      this.buildForm();
      this.lspTatId = '';
    }
    this.getCustomers();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getTransporterDetail();
    this.getPriorityDetail();
    this.getLsps(this.identityService.getLoggedUserId());
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
      tat: new FormControl(null, [Validators.required,Validators.min(1), Validators.max(10)]),
      priority: new FormControl(null, [Validators.required,Validators.min(1), Validators.max(10)]),
      bookingType: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
      createdBy:new FormControl(this.identityService.getLoggedUserId()),
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
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  getPriorityDetail(){
    this.docketService.getTrackingList('PRIORITY').subscribe({
      next: (response) => {
        if (response.success) {
          this.priority=response.data;
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }


  getCustomers(event?:any) {
    if(event){
      this.lspTatForm.patchValue({
        lspId: null
      })
    }
    this.lspTatService.getCustomers(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
          if(this.userRoles !== 'SA' && response.data.length > 0){
            this.lspTatForm.patchValue(response.data[0]);
          }
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
  getLsps(customerId:string) {
    this.lspTatService.getLsps(customerId).subscribe({
      next: (response) => {
        if (response) {
          this.lsps = response.data;
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
  onSubmitLspTat(form: FormGroup): void {
    if (form.valid) {
      const payload={
        ...form.value,
        updatedBy : this.lspTatId ? this.identityService.getLoggedUserId():null
      }
      !this.lspTatId ? this.addLspTat(payload) : this.updateLspTat(payload);
    }else{
      form.markAllAsTouched();
    }
  }

  addLspTat(form: any): void {
    this.lspTatService.addLspTat(form).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.buildForm()
           if(this.userRoles !== 'SA' && this.customers && this.customers.length > 0){
            this.lspTatForm.patchValue(this.customers[0]);
          }
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  updateLspTat(form: any): void {
    this.lspTatService
      .updateLspTat(this.lspTatId, form)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sweetAlertService.success(response.data.message);
            this.dataEmitter.emit();
            this.lspTatForm.reset();
          } else {
            this.sweetAlertService.error(response.error.message);
          }
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.error.message);
        },
      });
  }

  onClose(){
      this.buildForm();
      this.getCustomers();
      this.getLsps(this.identityService.getLoggedUserId());
      // this.dataEmitter.emit();
  }
}
