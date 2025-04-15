import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocketService } from '../../../shared/services/docket.service';
import { TrackingListResponse } from '../../../shared/models/docket.model';
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
  public transporter:TrackingListResponse[]=[]

  constructor(
    private docketService:DocketService,
    private sweetAlertService:SweetAlertService,
    private commonService:CommonService
  ){}

  ngOnInit(){
    this.buildForm();
    this.getTransporterDetail();
    this.statusUpdateForm.controls['docketNumber'].valueChanges.subscribe((value) => {
      if(value){
        this.getDocketNoChange(value);
      }
    });
  }

  buildForm(){
    this.statusUpdateForm=new FormGroup({
      docketNumber: new FormControl(null,[Validators.required]),
      lspName:new FormControl(null), 
      orderDate:new FormControl(null),
      statusDate:new FormControl(null,[Validators.required]),
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

  getDocketNoChange(docketNumber:any){
    this.docketService.getDocketDetail(docketNumber).subscribe({
      next: (response) => {
        if(response && response.data){
          this.statusUpdateForm.patchValue({
            orderDate:response.data.bookingDate,
            lspName:response.data.lspName,
            fromCity:response.data.fromLocation,
            toCity:response.data.toLocation,
            currentStatus:response.data.transporter
          });
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
