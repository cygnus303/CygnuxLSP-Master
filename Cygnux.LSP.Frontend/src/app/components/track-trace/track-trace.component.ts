import { Component, TemplateRef } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import feather from 'feather-icons';
import { TrackTraceService } from '../../shared/services/track-trace.service';
import { TrackTraceResponse } from '../../shared/models/trackTrace.model';
import { IdentityService } from '../../shared/services/identity.service';
import { Roles } from '../../shared/constants/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-track-trace',
  standalone: false,
  templateUrl: './track-trace.component.html',
  styleUrl: './track-trace.component.scss',
   animations: [
     trigger('collapseAnimation', [
      state('void', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ])
  ], 
  providers:[BsModalService]
})
export class TrackTraceComponent {
  public docketInput: string = '';
  public docketList: string[] = [];
  public expandedIndex: number | null = null;
  public trackTraceList:TrackTraceResponse[]=[];
  public userRoles = JSON.parse(localStorage.getItem(Roles) || '[]');
  public modalRef!: BsModalRef;
  constructor( 
   public commonService: CommonService,
   private trackTraceService:TrackTraceService,
   public identityService:IdentityService,
   private modalService: BsModalService
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

  openPOD(Templatepod: TemplateRef<any>){
    this.modalRef = this.modalService.show(Templatepod, {  class: 'modal-lg modal-dialog-centered',backdrop: true });
  }

  onSearchTrackTrace(){
    const docketString = this.docketList.length ? this.docketList.join(',') : null;
    this.trackTraceService.GetTrackigList(docketString,this.identityService.getLoggedUserId()).subscribe(res => {
      this.trackTraceList = res.data;

      setTimeout(() => {
        feather.replace();
      });
    });
  }

  removeCard(docket: string): void {
    this.docketList = this.docketList.filter(item => item !== docket);
    this.trackTraceList = this.trackTraceList.filter(item => item.docketNo !== docket);
  }

  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
  }

  removeDocket(docket: string): void {
    this.docketList = this.docketList.filter(d => d !== docket);
    this.onSearchTrackTrace();
  }

toggleMoreView(index: number): void {
  this.expandedIndex = this.expandedIndex === index ? null : index;
}
}
