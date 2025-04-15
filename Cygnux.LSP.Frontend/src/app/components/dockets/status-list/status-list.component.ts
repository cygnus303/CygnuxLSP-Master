import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { environment } from '../../../../environments/environment';
import { SweetAlertService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-status-list',
  standalone: false,
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.scss'
})
export class StatusListComponent {
  files: File[] = [];

constructor(
  private sweetAlertService:SweetAlertService
){
  defineElement(lottie.loadAnimation);
}

downloadSampleFile(event:any){
  event.preventDefault();
  let path =
    environment.apiUrl.replace('/api/v1', '') + 'Uploads/Status_Import.xlsx';
  window.open(path, '_blank');
}

  onChangeFile(event: any) {
    const file = event.addedFiles[0];
    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ];
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
        reader.readAsArrayBuffer(file);
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
}
