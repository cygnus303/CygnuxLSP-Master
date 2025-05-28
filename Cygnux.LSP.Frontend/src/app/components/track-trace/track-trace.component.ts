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
import JSZip from 'jszip';

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
  public selectedPodImageUrl?:TrackTraceResponse;
  public isLSP:boolean=false;
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

  ngOnInit(){
    this.isLSP= JSON.parse(localStorage.getItem('roles')||'')==='lsp Admin';
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
    this.onSearchTrackTrace();
  }
}

  openPOD(Templatepod: TemplateRef<any>,data:TrackTraceResponse){
     this.selectedPodImageUrl = data;
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

downloadPod(pod: any): void {
  if (!pod?.podLink) {
    console.error('No image link found.');
    return;
  }

  // Force HTTPS in case backend returns HTTP
  const secureUrl = pod.podLink.startsWith('http://')
    ? pod.podLink.replace('http://', 'https://')
    : pod.podLink;

  fetch(secureUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.extractFileName(secureUrl); // Use cleaned URL
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
    })
    .catch(error => {
      console.error('Image download failed:', error);
      alert('Failed to download image. Please try again or check the image URL.');
    });
}

extractFileName(url: string): string {
  try {
    const path = url.split('?')[0]; // Remove query params
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return filename || `downloaded_image_${Date.now()}.jpg`;
  } catch {
    return `downloaded_image_${Date.now()}.jpg`;
  }
}

downloadImagesAsZip(): void {
  const zip = new JSZip();

  const imagePromises = this.trackTraceList
    .filter(item => item.podLink && item.podLink !== '-') // skip invalid podLinks
    .map(item => {
      const secureUrl = item.podLink.replace('http://', 'https://');
      const fileName = `docket_${item.docketNo}_${item.transporterDesc}.jpg`;

      return fetch(secureUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          zip.file(fileName, blob);
        })
        .catch(err => {
          console.error(`Failed to fetch ${secureUrl}:`, err);
        });
    });

  Promise.all(imagePromises).then(() => {
    if (Object.keys(zip.files).length > 0) {
      zip.generateAsync({ type: "blob" }).then(zipBlob => {
        const url = window.URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'POD_Images.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
    } else {
      alert('No valid images found to download.');
    }
  });
}


}
