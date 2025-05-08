import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { environment } from '../../../../environments/environment';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-status-list',
  standalone: false,
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.scss'
})
export class StatusListComponent {
 public  files: File[] = [];
 public selectedFile:any;
constructor(private sweetAlertService: SweetAlertService,public docketService:DocketService,public commonService: CommonService,  private identityService:IdentityService) {defineElement(lottie.loadAnimation)}
downloadSampleFile(event: any) {
  event.preventDefault();
  this.commonService.updateLoader(true);
  this.docketService.DownloadSampleStatusUpload(this.identityService.getLoggedUserId()).subscribe({
    next: (response: Blob) => {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'DocketStatusUpload.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
      this.commonService.updateLoader(false);
    },
    error: (error) => {
      this.sweetAlertService.error('Failed to download file.');
      this.commonService.updateLoader(false);
    }
  });
}

  onChangeFile(event: any) {
    const file = event.addedFiles[0];
    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ];
      this.selectedFile = file;
      if (validExcelTypes.includes(file.type)) {
        this.files = [file];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet); // Extract as array of objects
          // this.statusUpdate = Array.isArray(jsonData) ? jsonData : [];
        };
        // reader.readAsArrayBuffer(file);
      } else {
        this.sweetAlertService.error('Please upload a valid excel file.');
        this.files = [];
      }
    }
  }

  onRemove(file: File) {
      this.files = this.files.filter(f => f !== file);
      // this.statusUpdate=[];
    }

  exportExcel(){
    this.selectedFile
  }
}
