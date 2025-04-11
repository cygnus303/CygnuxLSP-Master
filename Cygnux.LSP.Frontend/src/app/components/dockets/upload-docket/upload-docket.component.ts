import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as XLSX from 'xlsx';
import { SweetAlertService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-upload-docket',
  standalone: false,
  templateUrl: './upload-docket.component.html',
  styleUrl: './upload-docket.component.scss'
})
export class UploadDocketComponent {
  files: File[] = [];
  docketData:any[]=[];

  constructor(
    private sweetAlertService:SweetAlertService
  ){}

  downloadSampleFile(event: any) {
    event.preventDefault();
    let path =
      environment.apiUrl.replace('/api/v1', '') + 'Uploads/Docket_Import.xlsx';
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

          this.docketData = Array.isArray(jsonData) ? jsonData : [];
          console.log('Excel Data:', this.docketData);
        };

        reader.readAsArrayBuffer(file);
      } else {
        this.sweetAlertService.error('Please upload a valid excel file.');
        this.files = [];
      }
    }
  }

  onRemoveFile(file: File) {
    this.files = this.files.filter(f => f !== file);
    this.docketData=[];
  }
}
