import { Component } from '@angular/core';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { environment } from '../../../../../environments/environment';
import { DocketService } from '../../../../shared/services/docket.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ValidateFileResponse } from '../../../../shared/models/docket.model';
import { IdentityService } from '../../../../shared/services/identity.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-import-docket',
  standalone: false,
  templateUrl: './import-docket.component.html',
  styleUrl: './import-docket.component.scss'
})
export class ImportDocketComponent {
  files: File[] = [];
  selectedFile:any;
  validateData:ValidateFileResponse[]=[];
  
    constructor(
      private sweetAlertService:SweetAlertService,
      private docketService:DocketService,
      private commonService:CommonService,
      private identityService:IdentityService
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
          this.selectedFile = file; 
  
          // const reader = new FileReader();
  
          // reader.onload = (e: any) => {
          //   const data = new Uint8Array(e.target.result);
          //   const workbook = XLSX.read(data, { type: 'array' });
          //   const sheetName = workbook.SheetNames[0];
          //   const worksheet = workbook.Sheets[sheetName];
  
          //   const jsonData = XLSX.utils.sheet_to_json(worksheet); // Extract as array of objects
  
          //   this.docketData = Array.isArray(jsonData) ? jsonData : [];
          //   console.log('Excel Data:', this.docketData);
          // };
  
          // reader.readAsArrayBuffer(file);
        } else {
          this.sweetAlertService.error('Please upload a valid excel file.');
          this.files = [];
        }
      }
    }
  
    onRemoveFile(file: File) {
      this.files = this.files.filter(f => f !== file);
      this.validateData=[];
    }

    // uploadDocketFile(){
    //   this.commonService.updateLoader(true);
    //   const formData = new FormData();
    //   formData.append('customerId',this.identityService.getLoggedUserId())
    //   formData.append('file', this.selectedFile);
    //   this.docketService.validateDocketList(formData).subscribe({
    //     next: (response) => {
    //       if (response) {
    //         // this.edit.emit(response.data);
    //         this.validateData=response.data
    //       }
    //       this.commonService.updateLoader(false);
    //     },
    //     error: (response: any) => {
    //       this.sweetAlertService.error(response.error.Message);
    //       this.commonService.updateLoader(false);
    //     },
    //   });
    // }

    uploadDocketFile() {
      this.commonService.updateLoader(true);
      const formData = new FormData();
      formData.append('customerId', this.identityService.getLoggedUserId());
      formData.append('file', this.selectedFile);
    
      this.docketService.validateDocketList(formData).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.validateData = response.data;
    
            // 🔽 Generate Excel and auto-download
            this.exportToExcel(this.validateData, 'Invalid_Dockets');
          }
    
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.error.Message);
          this.commonService.updateLoader(false);
        },
      });
    }

    exportToExcel(data: any[], fileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Errors': worksheet },
        SheetNames: ['Errors']
      };
    
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
    
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
    
      saveAs(blob, `${fileName}.xlsx`);
    }

    onClose(){
      this.validateData=[];
      this.files=[];
    }
    
    
}