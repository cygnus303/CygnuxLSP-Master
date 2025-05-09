import { Component, EventEmitter, Output, output } from '@angular/core';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { DocketService } from '../../../../shared/services/docket.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ValidateFileResponse } from '../../../../shared/models/docket.model';
import { IdentityService } from '../../../../shared/services/identity.service';
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
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
    constructor(
      private sweetAlertService:SweetAlertService,
      private docketService:DocketService,
      private commonService:CommonService,
      private identityService:IdentityService
    ){}
  
    downloadSampleFile(event: any) {
      event.preventDefault();
      this.commonService.updateLoader(true);
      this.docketService.downloadSampleDocketUpload(this.identityService.getLoggedUserId()).subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'DocketUpload.xlsx';
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
          // const reader = new FileReader();
              // reader.onload = (e: any) => {
              //   const data = new Uint8Array(e.target.result);
              //   const workbook = XLSX.read(data, { type: 'array' });
              //   const sheetName = workbook.SheetNames[0];
              //   const worksheet = workbook.Sheets[sheetName];
              //   const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
              //     header: 1,
              //   });
              //   const headers = rows[0]?.map((h: any) => String(h).trim());
              //   const expectedHeaders = ['LSPName', 'DocketNo', 'InvoiceNo' , 'Date','FromLocation','ToLocation','Quantity','ModeOfTransporter'];
              //   const isValidHeaders = headers && headers.length === expectedHeaders.length && headers.every((val, i) => val === expectedHeaders[i]);
              //   if (!isValidHeaders) {
              //     this.sweetAlertService.error('Please upload valid excel file');
              //     this.resetFileSelection();
              //     return;
              //   }
              //   //  Proceed if headers are correct
              //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
              // };
              // this.files = [file];
              // this.selectedFile = file;
              // reader.readAsArrayBuffer(file);
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

    uploadDocketFile() {
      this.commonService.updateLoader(true);
      const formData = new FormData();
      formData.append('file', this.selectedFile);
    
      this.docketService.validateDocketList(this.identityService.getLoggedUserId(),formData).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.validateData = response.data;
            this.docketService.exportToExcel(this.validateData, 'Invalid_Dockets');
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.error.Message);
          this.commonService.updateLoader(false);
        },
      });
    }

    onClose(){
      this.validateData=[];
      this.files=[];
    }

    onSave(){
      this.commonService.updateLoader(true);
      const transformedList = this.validateData.map(({ lsp, errorMessage, errorCode, date, customer, ...rest }) => ({
       ...rest, bookingDate: date, customerId: customer, lspId: lsp, remarks: "", isCancel: false}));
        this.docketService.InsertExcelUplaodDocketData(this.identityService.getLoggedUserId(),transformedList).subscribe({
        next: (response) => {
          if (response.success) {
            this.validateData=[];
            this.files = [];
            this.dataEmitter.emit()
            this.sweetAlertService.success(response.data.message);
          } else {
            this.sweetAlertService.error(response.data.message);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.data.message);
          this.commonService.updateLoader(false);
        },
      });
  }
}