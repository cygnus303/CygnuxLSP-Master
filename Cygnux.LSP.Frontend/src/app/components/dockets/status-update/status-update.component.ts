import {  Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocketService } from '../../../shared/services/docket.service';
import { DocketResponse, TrackingListResponse } from '../../../shared/models/docket.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { IdentityService } from '../../../shared/services/identity.service';

@Component({
  selector: 'app-status-update',
  standalone: false,
  templateUrl: './status-update.component.html',
  styleUrl: './status-update.component.scss'
})
export class StatusUpdateComponent {
  public statusUpdateForm!:FormGroup;
  public transporter:TrackingListResponse[]=[];
  public filteredTransporter: TrackingListResponse[] = [];
  public currentStatusValue: string = '';
  @Input() docketResponse: DocketResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private docketService:DocketService,
    private sweetAlertService:SweetAlertService,
    private identityService:IdentityService
  ){}

ngOnChanges(changes:SimpleChanges){
  if (changes['docketResponse'] && this.docketResponse) {
    this.statusUpdateForm.patchValue(this.docketResponse);
    this.currentStatusValue= this.docketResponse.currentStatus
        this.filterNextStatus();
  }
} 

  ngOnInit(){
    this.buildForm();
    this.getTransporterDetail();
  }

  buildForm(){
    this.statusUpdateForm = new FormGroup({
      docketNo: new FormControl(null,[Validators.required]),
      transporterDesc:new FormControl(null), 
      bookingDate:new FormControl(null),
      statusDate:new FormControl(new Date()),
      fromLocation:new FormControl(null),
      toLocation:new FormControl(null),
      currentStatus:new FormControl(null),
      nextDocketStatus:new FormControl(null,[Validators.required]),
      pod:new FormControl(null),
      customerId:new FormControl(''),
      invoiceNo:new FormControl(''),
      quantity:new FormControl(''),
      transporter:new FormControl(''),
      transportMode:new FormControl(''),
      docketId:new FormControl('')
    })
  }

getTransporterDetail() {
  this.docketService.getTrackingList('DOCKSTAUS').subscribe({
    next: (response) => {
      if (response.success) {
        this.transporter = response.data;
      } else {
        this.sweetAlertService.error(response.error.message);
      }
    },
    error: (response: any) => {
      this.sweetAlertService.error(response.error.message);
    },
  });
}

filterNextStatus() {
  const currentId = Number(this.currentStatusValue);  // make sure it's a number

  if (currentId === 6) { // Delivered
    this.filteredTransporter = [];
    this.statusUpdateForm.patchValue({ nextDocketStatus: null });
  } else {
    const nextCodeId = (currentId + 1).toString();  // convert back to string since your codeId is string

    // set filtered transporter only for next status
    this.filteredTransporter = this.transporter.filter((item: any) => item.codeId === nextCodeId);

    if (this.filteredTransporter.length > 0) {
      this.statusUpdateForm.patchValue({ nextDocketStatus: nextCodeId });
    } else {
      this.statusUpdateForm.patchValue({ nextDocketStatus: null });
    }
  }
}


  onSubmitStatus(form: FormGroup){
    if (form.valid) {
      const payload = {
        currentStatus:form.value.nextDocketStatus,
      }
        this.docketService.singleUpdateDocketSts(form.value.docketId,this.identityService.getLoggedUserId(),payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.buildForm();
            this.dataEmitter.emit();
            this.sweetAlertService.success(response.data.message);
          } else {
            this.sweetAlertService.error(response.error.message);
          }
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.data.message);
        },
      });
  }
}
}
