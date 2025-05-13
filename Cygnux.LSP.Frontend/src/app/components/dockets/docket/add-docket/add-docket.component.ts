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
  public customerId : string='' ;
  public transportMode:TrackingListResponse[]=[];
  @Input() docketResponse: DocketResponse | null = null;
  @Input() isSelected: string = '';
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  constructor(
    private docketService: DocketService,
    private commonService: CommonService,
    private sweetAlertService: SweetAlertService,
    private lspTatService: LspMappingService,
    private identityService:IdentityService,
    
  ) {
    this.docketForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.getTransporterDetail();
    this.docketId = '';
    this.buildForm();
    this.getCustomers();
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
      currentStatus:new FormControl(this.docketId === '' ? '1' : null)
    });
  }

ngOnChanges(changes: SimpleChanges): void {
  if (changes['docketResponse'] && this.docketResponse) {
    this.docketResponse.bookingDate = new Date(this.docketResponse.bookingDate);
    this.docketId = this.docketResponse.docketId;
    if(this.isSelected === 'edit'){
      this.onSelectCustomer(this.docketResponse , true)
      this.onSelectOrigin(this.docketResponse, 'lsp')
    }
    this.docketForm.patchValue(this.docketResponse);
  } else {
    this.docketId = '';
    this.buildForm();
    this.docketForm.patchValue({
      bookingDate: new Date(),
      status:this.docketId ? null : '1',
    });
    this.getCustomers();
  }
}

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }

  onClose(){
    this.docketForm.reset();
    this.buildForm();
    this.getCustomers();
    this.dataEmitter.emit();
  }

  onSubmitDocket(form: FormGroup): void {
    if (form.valid) {
      let forms = {
        ...form.value,
        lspId:this.docketForm.value.transporter,
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
          if(this.userRoles !== 'SA' && response.data.length > 0){
            this.docketForm.patchValue(response.data[0])
            // this.onSelectCustomer(response.data[0])
            // this.onSelectOrigin(response.data[0])
            this.customerId=response.data[0].customerId
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
            this.docketForm.reset();
            this.buildForm();
            this.dataEmitter.emit(); // Emitting the data to the parent
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

  onSelectOrigin(event: any, type: string): void {
    this.commonService.updateLoader(true);
    const formValues = this.docketForm.value;
    let selectedLsp = formValues.transporter || '';
    let selectedFromLocation = formValues.fromLocation || '';
    let selectedToLocation = formValues.toLocation || '';
  
    switch (type) {
      case 'lsp':
        selectedLsp = event?.lspId || event?.transporter;
        selectedFromLocation = '';
        selectedToLocation = '';
        this.docketForm.patchValue({
          fromLocation: null,
          toLocation: null
        });
        break;
  
      case 'fromLocation':
        selectedFromLocation = event.fromLocation;
        selectedToLocation = '';
        this.docketForm.patchValue({
          toLocation: null
        });
        break;
  
      case 'toLocation':
        selectedToLocation = event.toLocation;
        break;
    }
  
    const filters = {
      CustomerId: formValues.customerId || this.customerId,
      LspId: selectedLsp,
      origin: selectedFromLocation,
      destination: selectedToLocation
    };
  
    this.docketService.getLocationData(filters).subscribe({
      next: (response) => {
        if (response.success) {
          if (type === 'lsp') {
            this.customerLocation = response.data;
          } else if (type === 'fromLocation') {
            this.customerWHStoreLocation = response.data;
          }
  
          if (response.data?.[0]?.mode) {
            this.docketForm.patchValue({
              transportMode: response.data[0].mode
            });
          }
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      }
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
