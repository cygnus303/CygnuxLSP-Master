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
  public files: File[] = [];
  public selectedFile:any;
  public validateData:ValidateFileResponse[]=[];
  
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
          // };
  
          // reader.readAsArrayBuffer(file);
          const reader = new FileReader();
              reader.onload = (e: any) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
                  header: 1,
                });
                const headers = rows[0]?.map((h: any) => String(h).trim());
                const expectedHeaders = ['LSPName', 'DocketNo', 'InvoiceNo' , 'Date','FromLocation','ToLocation','Quantity','ModeOfTransporter'];
                const isValidHeaders = headers && headers.length === expectedHeaders.length && headers.every((val, i) => val === expectedHeaders[i]);
                if (!isValidHeaders) {
                  this.sweetAlertService.error('Please upload valid excel file');
                  this.resetFileSelection();
                  return;
                }
                //  Proceed if headers are correct
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                this.files = [file];
                this.selectedFile = file;
              };
              reader.readAsArrayBuffer(file);
        } else {
          this.sweetAlertService.error('Please upload a valid excel file.');
          this.files = [];
        }
      }
    }

    get isValidData(): boolean {
      return this.validateData.length > 0 && this.validateData.every(item => !item.errorCode);
    }
    

    resetFileSelection() {
      this.selectedFile = null;
      this.files = [];
      this.validateData = [];                                                                                                                                                                                                          
    }
  
    onRemoveFile(file: File) {
      this.files = this.files.filter(f => f !== file);
      this.validateData=[];
    }

    formatDateString(dateStr: string): string {
      if (!dateStr) return '';
    
      const [datePart, timePart] = dateStr.split(' ');
      const [day, month, year] = datePart.split('-');
      return `${day}-${month}-${year}`;
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
      formData.append('file', this.selectedFile);
    
      this.docketService.validateDocketList(this.identityService.getLoggedUserId(),formData).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.validateData = response.data;
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