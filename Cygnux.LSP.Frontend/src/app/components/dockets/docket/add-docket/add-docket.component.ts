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
import { CustomerResponse } from '../../../../shared/models/customer.model';
import { DocketResponse, CustomerLocationResponse, TrackingListResponse } from '../../../../shared/models/docket.model';
import { CommonService } from '../../../../shared/services/common.service';
import { DocketService } from '../../../../shared/services/docket.service';
import { IdentityService } from '../../../../shared/services/identity.service';
import { LspMappingService } from '../../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { LspResponse } from '../../../../shared/models/lsp.model';


@Component({
  selector: 'app-add-docket',
  standalone: false,
  templateUrl: './add-docket.component.html',
  styleUrls: ['./add-docket.component.scss'],
})
export class AddDocketComponent implements OnInit, OnChanges {
  public docketForm!: FormGroup;
  public docketId: string = '';
  public customers: CustomerResponse[] = [];
  public customerLocation : CustomerLocationResponse[]=[];
  public customerWHStoreLocation : CustomerLocationResponse[]=[];
  public lsps: LspResponse[] | null = null;
  public transporter:TrackingListResponse[]=[];
  public transportMode:TrackingListResponse[]=[];
  @Input() docketResponse: DocketResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  constructor(
    private docketService: DocketService,
    private commonService: CommonService,
    private sweetAlertService: SweetAlertService,
    private lspTatService: LspMappingService,
    private identityService:IdentityService
  ) {
    this.docketForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.docketId = '';
    this.getCustomers();
    this.getTransporterDetail();
    this.getTransportModeDetail();
    this.getLsps();
  }

  buildForm(): void {
    this.docketForm = new FormGroup({
      docketNo: new FormControl(null, [Validators.required]),
      bookingDate: new FormControl(new Date(), [Validators.required]),
      fromLocation: new FormControl(null),
      toLocation: new FormControl(null),
      customerId: new FormControl(null),
      invoiceNo: new FormControl(null),
      transporter: new FormControl(null),
      transportMode: new FormControl(null),
      quantity: new FormControl(null),
      // EntryBy  :new FormControl(this.identityService.getLoggedUserId()),
      lspId:new FormControl(null),
      currentStatus:new FormControl(this.docketId ? null : '1')
    });
  }

ngOnChanges(changes: SimpleChanges): void {
  if (changes['docketResponse'] && this.docketResponse) {
    this.docketResponse.bookingDate = new Date(this.docketResponse.bookingDate);
    this.docketId = this.docketResponse.id;
    this.docketForm.patchValue(this.docketResponse);
    this.onSelectCustomer(this.docketResponse , true)
    this.onSelectOrigin(this.docketResponse)
  } else {
    this.docketForm.reset();
    this.docketId = '';
    this.docketForm.patchValue({
      bookingDate: new Date(),
      status:this.docketId ? null : '1'
    });
  }
}

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }

  onClose(){
    this.docketForm.reset();
    this.buildForm();
    this.dataEmitter.emit();
  }

  onSubmitDocket(form: FormGroup): void {
    if (form.valid) {
      let forms = {
        ...form.value,
        // EntryBy:this.identityService.getLoggedUserId(),
        isCancel:false,
        bookingDate:form.value.bookingDate.toISOString().split('T')[0]
      }
      !this.docketId ? this.addDocket(forms) : this.updateDocket(forms);
    }else{
      form.markAllAsTouched();
    }
  }
  getCustomers() {
    this.commonService.updateLoader(true);
    this.lspTatService.getCustomers(this.identityService.getLoggedUserId()).subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
          if(this.userRoles === 'Customer Admin'){
            this.docketForm.patchValue(response.data[0])
            this.onSelectCustomer(response.data[0])
          }
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
    this.lspTatService.getLsps(this.identityService.getLoggedUserId()).subscribe({
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

  addDocket(form: any): void {
    this.commonService.updateLoader(true);
    this.docketService.addDocket(form).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit(); // Emitting the data to the parent
          this.docketForm.reset();
          this.buildForm();
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

  updateDocket(form: any): void {
    this.commonService.updateLoader(true);
    this.docketService
      .updateDocket(this.docketId, form)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sweetAlertService.success(response.data.message);
            this.dataEmitter.emit(); // Emitting the data to the parent
            this.docketForm.reset();
            this.buildForm();
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
  onSelectCustomer(event:any ,resetLocations: boolean = false){
    this.commonService.updateLoader(true);
    if(!resetLocations){
      this.docketForm.patchValue({
        fromLocation:null,
        toLocation:null
      });
    }
    const filters={
      CustomerId:event.customerId,
      origin:event.location ? event.location : ''
    }
    this.docketService.getLocationData(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.customerLocation=response.data;
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

  onSelectOrigin(event:any){
    this.commonService.updateLoader(true);
    this.docketForm.patchValue({
      lspId: event.lspId
    });
    const filters={
      CustomerId:event.customerId,
      origin:event.location ? event.location : event.fromLocation
    }
    this.docketService.getLocationData(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.customerWHStoreLocation=response.data;
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

  getTransporterDetail(){
    this.docketService.getTrackingList('DOCKSTAUS').subscribe({
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

  getTransportModeDetail(){
    this.docketService.getTrackingList('TRN').subscribe({
      next: (response) => {
        if (response.success) {
          this.transportMode=response.data;
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
