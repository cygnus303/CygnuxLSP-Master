import {  Component, Input, SimpleChanges } from '@angular/core';
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
  @Input() docketResponse: DocketResponse | null = null;

  constructor(
    private docketService:DocketService,
    private sweetAlertService:SweetAlertService,
    private commonService:CommonService,
  ){}

ngOnChanges(changes:SimpleChanges){
  if (changes['docketResponse'] && this.docketResponse) {
    this.statusUpdateForm.patchValue({
      docketNumber:this.docketResponse.docketNo,
      lspName:this.docketResponse.transporterDesc,
      orderDate:this.docketResponse.bookingDate,
      fromCity:this.docketResponse.fromLocation,
      toCity:this.docketResponse.toLocation,
      currentStatus:this.docketResponse.currentStatus
    })
  } 
}

  ngOnInit(){
    this.buildForm();
    this.getTransporterDetail();
  }

  buildForm(){
    this.statusUpdateForm=new FormGroup({
      docketNumber: new FormControl(null,[Validators.required]),
      lspName:new FormControl(null), 
      orderDate:new FormControl(null),
      statusDate:new FormControl(new Date(),[Validators.required]),
      fromCity:new FormControl(null),
      toCity:new FormControl(null),
      currentStatus:new FormControl(null),
      changeStatus:new FormControl(null,[Validators.required]),
      pod:new FormControl(null)
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
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  onSubmitStatus(form: FormGroup){
    if (form.valid) {
      let forms = {
        ...form.value,
      }
  }
}

  // getDocketNoChange(docketNumber:any){
  //   this.docketService.getDocketDetail(docketNumber).subscribe({
  //     next: (response) => {
  //       if(response && response.data){
  //         const result = response.data[0];
  //         this.statusUpdateForm.patchValue({
  //           orderDate: result.bookingDate,
  //           lspName: result.lspName,
  //           fromCity: result.fromLocation,
  //           toCity: result.toLocation,
  //           currentStatus: result.transporter
  //         });
  //       } else {
  //         this.sweetAlertService.error(response.error.message);
  //       }
  //       this.commonService.updateLoader(false);
  //     },
  //     error: (response: any) => {
  //       this.sweetAlertService.error(response.error.message);
  //       this.commonService.updateLoader(false);
  //     },
  //   });
  // }
}
