import {  Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocketService } from '../../../shared/services/docket.service';
import { DocketResponse, TrackingListResponse } from '../../../shared/models/docket.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-status-update',
  standalone: false,
  templateUrl: './status-update.component.html',
  styleUrl: './status-update.component.scss'
})
export class StatusUpdateComponent {
  public statusUpdateForm!:FormGroup;
  public transporter:TrackingListResponse[]=[];
  nextStatusOptions: any[] = [];
  @Input() docketResponse: DocketResponse | null = null;
 @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private docketService:DocketService,
    private sweetAlertService:SweetAlertService
  ){}

ngOnChanges(changes:SimpleChanges){
  if (changes['docketResponse'] && this.docketResponse) {
    this.statusUpdateForm.patchValue(this.docketResponse)
  }
}

  ngOnInit(){
    this.buildForm();
    this.getTransporterDetail();
  //   this.statusUpdateForm.get('currentStatus')?.valueChanges.subscribe((currentStatusId: string) => {
  //   this.updateNextStatusOptions(currentStatusId);
  // });
  }

//  updateNextStatusOptions(currentStatusId: string) {
//   const currentIndex = this.transporter.findIndex((status:any) => status.codeId === currentStatusId);

//   if (currentIndex !== -1) {
//     const currentStatus = this.transporter[currentIndex];

//     // If current status is "Delivered"
//     if (currentStatus.codeDesc.toLowerCase() === 'delivered') {
//       this.nextStatusOptions = [currentStatus];
//       this.statusUpdateForm.get('nextDocketStatus')?.setValue(currentStatus.codeId);
//       this.statusUpdateForm.get('nextDocketStatus')?.disable(); // Disable the control
//     } else if (currentIndex + 1 < this.transporter.length) {
//       const nextStatus = this.transporter[currentIndex + 1];
//       this.nextStatusOptions = [nextStatus];
//       this.statusUpdateForm.get('nextDocketStatus')?.enable(); // Enable control if previously disabled
//       this.statusUpdateForm.get('nextDocketStatus')?.setValue(null);
//     } else {
//       this.nextStatusOptions = [];
//       this.statusUpdateForm.get('nextDocketStatus')?.reset();
//       this.statusUpdateForm.get('nextDocketStatus')?.enable();
//     }
//   }
// }


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

  getTransporterDetail(){
    this.docketService.getTrackingList('DOCKSTAUS').subscribe({
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

  onSubmitStatus(form: FormGroup){
    if (form.valid) {
      const payload = {
        currentStatus:form.value.nextDocketStatus,
      }
        this.docketService.singleUpdateDocketSts(form.value.docketId,payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.buildForm();
            this.dataEmitter.emit();
            this.sweetAlertService.success(response.data.message);
          } else {
            this.sweetAlertService.error(response.data.message);
          }
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.data.message);
        },
      });
  }
}
}
