import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-import-docket',
  standalone: false,
  templateUrl: './import-docket.component.html',
  styleUrl: './import-docket.component.scss'
})
export class ImportDocketComponent {
  excelData: any[][] = [];
  files: File[] = [];
  selectedFile: File | null = null;


  constructor(
    private docketService:DocketService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService
  ){}

  ngOnInit(){}
  

  onSelect(event:any) {
    this.files.push(...event.addedFiles);
    console.log(event);
  }
  
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    if (this.selectedFile === file) {
      this.selectedFile = null;
    }
  }
  
  
  onClose(){
    // this.files =[]
  }
  
  
  onDropzoneSelect(event: any) {
    const file = event.addedFiles[0];
  
    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-excel.template.macroEnabled.12',
      ];
  
      if (validExcelTypes.includes(file.type)) {
        this.files = [file]; // Allow only 1 file
        this.selectedFile = file;
      } else {
        this.sweetAlertService.error('Please upload a valid excel file (XLSX, XLS, or CSV).');
        this.selectedFile = null;
        this.files = [];
      }
    }
  }
  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.exportExcel(formData);
    } else {
      this.sweetAlertService.error('No valid file selected for upload.');
    }
  }
    
  triggerFileInput(event: Event): void {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  // importLead(dataToSubmit: any): void {
  //   this.leadService.importLead(dataToSubmit).subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.sweetAlertService.success(response.data.message);
  //       } else {
  //         this.sweetAlertService.error(response.error.message);
  //       }
  //       this.commonService.updateLoader(false);
  //     },
  //     error: (response: any) => {
  //       this.sweetAlertService.error(response);
  //     },
  //   });
  // }
  exportExcel(dataToSubmit:any){
    this.docketService.UploadDocket(this.identityService.getLoggedUserId(),dataToSubmit).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response);
      },
    });
  }

  
  
 
  

}
