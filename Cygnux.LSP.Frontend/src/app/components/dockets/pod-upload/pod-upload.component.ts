import { Component, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { CommonService } from '../../../shared/services/common.service';
@Component({
  selector: 'app-pod-upload',
  standalone: false,
  templateUrl: './pod-upload.component.html',
  styleUrl: './pod-upload.component.scss'
})
export class PodUploadComponent {
  public excelData: any[] = [];
  public files: File[] = [];
  public mappedData: any[] = [];
  public uploadedImages: any[] = [];
  public selectedFile: File | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private docketService:DocketService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService,
  ){}

  ngOnInit(){}
  
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    if (this.selectedFile === file) {
      this.selectedFile = null;
    }
    this.uploadedImages=[];
    this.mappedData=[];
  }
  
  onClose(){
    this.files = [];
    this.mappedData = [];
    this.uploadedImages=[];
  }

  onDropzoneSelect(event: any) {
    const file = event.addedFiles[0];
    if (!file) return;
    const validExcelTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
  
    if (!validExcelTypes.includes(file.type)) {
      this.sweetAlertService.error('Please upload a valid Excel file.');
      this.resetFileSelection();
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      this.excelData = jsonData;
      this.files = [file];
      this.selectedFile = file;
    };
    reader.readAsArrayBuffer(file);
  }
  
  resetFileSelection() {
    this.selectedFile = null;
    this.files = [];
    this.excelData = [];                                                                                                                                                                                                          
  }
 
  onRemoveimg(file: any) {
    const index = this.uploadedImages.findIndex(img => img.name === file.name);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
    }
  }

  onDropzoneimgSelect(event: any) {
    const files = event.addedFiles;
    for(let i = 0; i < files.length; i++){
      this.uploadedImages.push({
        name: files[i].name,
        file:files[i]
      });
    }
    // this.tryMapExcelToImages()
  }


  get isValidData(): boolean {
      return this.mappedData.length > 0 && this.mappedData.every(item => item.validationStatus === 'Valid');
  }

validatePODData(): void {
  const formData = new FormData();
  if (this.selectedFile !== null) {
    formData.append('file', this.selectedFile, this.selectedFile.name);
  }
  this.uploadedImages.forEach((item) => {
    if (item.file) {
      formData.append('images', item.file, item.name); // ✅ same key for all images
    }
  });
  this.docketService.validatePOD(this.identityService.getLoggedUserId(), formData).subscribe({
    next: (response) => {
      if (response.success) {
        this.mappedData = response.data
        this.dataEmitter.emit();
        this.sweetAlertService.success(response.data.message);
      } else {
        this.sweetAlertService.error(response.error.message);
      }
    },
    error: () => {
      this.sweetAlertService.error('Failed to upload data.');
    }
  });
}
  
exportExcel() {
  const formData = new FormData();

   const validDocketNumbers = this.mappedData.map(item => item.docketNo);

  const filteredImages = this.uploadedImages.filter(image =>
    validDocketNumbers.includes(image.name.replace(/\.[^/.]+$/, "")) // removes file extension
  );

  filteredImages.forEach((item) => {
    if (item.file) {
      formData.append('images', item.file, item.name);
    }
  });

  // Add JSON data as a blob (if needed by backend)
  const jsonBlob = new Blob([JSON.stringify(this.mappedData)], { type: 'application/json' });
  formData.append('jsonData', jsonBlob);

  // Submit the form
  this.docketService.uploadDocket(this.identityService.getLoggedUserId(), formData).subscribe({
    next: (response) => {
      if (response.success) {
        this.dataEmitter.emit();
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

downloadSampleFile(event: any) {
  event.preventDefault();
  this.docketService.DownloadSampleForPODupload(this.identityService.getLoggedUserId()).subscribe({
    next: (response: Blob) => {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'DocketPODUpload.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      this.sweetAlertService.error('Failed to download file.');
    }
  });
}
}
