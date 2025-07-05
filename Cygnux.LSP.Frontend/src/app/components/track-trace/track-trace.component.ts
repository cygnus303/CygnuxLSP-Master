import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';
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
import { Router } from '@angular/router';
import { SweetAlertService } from '../../shared/services/toastr.service';
import { ExportService } from '../../shared/services/export.service';

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
  public isContentVisible = false;
  public trackTraceList:TrackTraceResponse[]=[];
  public selectedPodImageUrl?:TrackTraceResponse;
  public isLSP:boolean=false;
  public userRoles = JSON.parse(localStorage.getItem(Roles) || '[]');
  public modalRef!: BsModalRef;
  public dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];

  skip = 0;
  take = 9;
  fromDate: string | null = null; // format: DD-MM-YYYY
  toDate: string | null = null;
  public isLoading = false;
  placeholderArray = Array(9);
  public newlyLoading = false;
  hasMoreData: boolean = true;

  constructor( 
   public commonService: CommonService,
   public trackTraceService:TrackTraceService,
   public identityService:IdentityService,
   private modalService: BsModalService,
   private router: Router,
   private sweetAlertService: SweetAlertService,
  private exportService: ExportService,
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
  
slideContentInAndNavigate() {
  this.isContentVisible = !this.isContentVisible;
 setTimeout(() => {
   this.router.navigate(['/track']);
 }, 100); 
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

  // onSearchTrackTrace(){
  //   const docketString = this.docketList.length ? this.docketList.join(',') : '';
  //   this.trackTraceService.GetTrackigList(docketString,this.identityService.getLoggedUserId()).subscribe(res => {
  //     // this.trackTraceList = res.data;
  //     this.trackTraceList = res.data.map((item: any) => {
  //       return {
  //         ...item,
  //         statusHistoryJson: JSON.parse(item.statusHistoryJson || '[]') // Convert string to JSON array
  //       };
  //     });
  //     setTimeout(() => {
  //       feather.replace();
  //     });
  //   });
  // }

  onDateRangeSelected(dates: any) {
  if (dates && dates.length === 2) {
    const [start, end] = dates;
    this.fromDate = this.formatDate(start);
    this.toDate = this.formatDate(end);
    this.onSearchTrackTrace();
  } else {
    this.fromDate = null;
    this.toDate = null;
  }
}

formatDate(date: Date): string {
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
}

onSearchTrackTrace(reset: boolean = true): void {
  const isInitialLoad = reset;

  // Reset state for initial load
  if (isInitialLoad) {
    this.skip = 0;
    this.trackTraceList = [];
    this.hasMoreData = true;
    this.isLoading = true;
  } else {
    this.newlyLoading = true;
  }

  const docketString = this.docketList.join(',') || '';
  const userId = this.identityService.getLoggedUserId();

  this.trackTraceService.GetTrackigList(docketString, userId, this.fromDate, this.toDate, this.skip, this.take)
    .subscribe({
      next: ({ data = [] }) => {
        const transformedData = data.map((item: any) => ({
          ...item,
          statusHistoryJson: JSON.parse(item.statusHistoryJson || '[]')
        }));

        this.trackTraceList.push(...transformedData);
        this.skip += transformedData.length;

        this.hasMoreData = transformedData.length === this.take;

        // Replace feather icons after DOM update
        requestAnimationFrame(() => feather.replace());

        this.isLoading = false;
        this.newlyLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.newlyLoading = false;
        this.hasMoreData = false;
      }
    });
}

onScroll(event: any) {
  const element = event.target;
  const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

  if (atBottom && !this.isLoading && !this.newlyLoading && this.hasMoreData) {
    this.onSearchTrackTrace(false);
  }
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
  this.trackTraceService.GetDownloadPODData(this.identityService.getLoggedUserId(), this.fromDate, this.toDate).subscribe({
      next: (response) => {
        if (response && response.data) {
        this.exportService.downloadPODsAsZip(response.data,'POD_Images')
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    })
}


}
