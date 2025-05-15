import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import feather from 'feather-icons';
import { TrackTraceService } from '../../shared/services/track-trace.service';
import { TrackTraceResponse } from '../../shared/models/trackTrace.model';
import { IdentityService } from '../../shared/services/identity.service';
@Component({
  selector: 'app-track-trace',
  standalone: false,
  templateUrl: './track-trace.component.html',
  styleUrl: './track-trace.component.scss'
})
export class TrackTraceComponent {
  docketInput: string = '';
  docketList: string[] = [];
  trackTraceList:TrackTraceResponse[]=[];

  constructor( 
   public commonService: CommonService,
   private trackTraceService:TrackTraceService,
   private identityService:IdentityService
  ){
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Track Trace');
  }

  addDocketNumber(event: KeyboardEvent): void {
    if (event.key === ',' && this.docketInput.trim()) {
      const docketNumber = this.docketInput.trim().slice(0, -1); // remove comma
      if (docketNumber) {
        this.docketList.push(docketNumber);
        this.docketInput = '';
      }
    }
  }
  
finalizeDocketInput(): void {
  const input = this.docketInput.trim();
  if (input) {
    const newDockets = input
      .split(/[\s,]+/) // split by space or comma
      .map(d => d.trim())
      .filter(d => d && !this.docketList.includes(d));

    this.docketList.push(...newDockets);
    this.docketInput = '';
  }
}

  onSearchTrackTrace(){
    const docketString = this.docketList.length ? this.docketList.join(',') : null;
    this.trackTraceService.GetTrackigList(docketString,this.identityService.getLoggedUserId()).subscribe(res => {
      this.trackTraceList = res.data;

      // Delay to ensure Angular has rendered the DOM
      setTimeout(() => {
        feather.replace();
      });
    });
  }
  
  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
  }

  removeDocket(docket: string): void {
    this.docketList = this.docketList.filter(d => d !== docket);
    this.onSearchTrackTrace();
  }
}
