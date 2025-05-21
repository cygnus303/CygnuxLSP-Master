import { Component, EventEmitter, Output } from '@angular/core';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { ValidDatePOD } from '../../../shared/models/docket.model';
@Component({
  selector: 'app-pod-upload',
  standalone: false,
  templateUrl: './pod-upload.component.html',
  styleUrl: './pod-upload.component.scss'
})
export class PodUploadComponent {
  public files: File[] = [];
  public mappedData: ValidDatePOD[] = [];
  public uploadedImages: any[] = [];
  public selectedFile: File | null = null;
  public validDate:ValidDatePOD[]=[]
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
      'text/csv'];
    if (!validExcelTypes.includes(file.type)) {
      this.sweetAlertService.error('Please upload a valid Excel file.');
      this.resetFileSelection();
      return;
    }
      this.files = [file];
      this.selectedFile = file;
  }
  
  get isValidData(): boolean {
    return this.mappedData.length > 0 && this.mappedData.every(item => item.isValid);
  }

  resetFileSelection() {
    this.selectedFile = null;
    this.files = [];
  }
 
  onRemoveimg(file: any) {
    const index = this.uploadedImages.findIndex(img => img.name === file.name);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
      const removedImageName = file.name.toLowerCase();

    this.mappedData.forEach(record => {
      if (record.imageName?.toLowerCase() === removedImageName) {
        record.isValid = false;
        record.validationStatus = 'Image was removed after validation.';
        record.imageName = ''; 
      }
    });
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
  }

exportExcel() {
  const formData = new FormData();
  this.uploadedImages.forEach((item) => {
    if (item.file) {
      formData.append('imgfiles', item.file, item.name);
    }
  });
  formData.append('docketJson', JSON.stringify(this.mappedData));

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

validatePODData(): void {
  const formData = new FormData();
  if (this.selectedFile !== null) {
    formData.append('file', this.selectedFile, this.selectedFile.name);
  }
  this.uploadedImages.forEach((item) => {
    if (item.file) {
      formData.append('images', item.file, item.name); 
    }
  });
  this.docketService.validatePOD(this.identityService.getLoggedUserId(), formData).subscribe({
    next: (response) => {
      if (response.success) {
        this.mappedData = response.data
        this.dataEmitter.emit();
        // this.sweetAlertService.success(response.data.message);
      } else {
        this.sweetAlertService.error(response.error.message);
      }
    },
    error: () => {
      this.sweetAlertService.error('Failed to upload data.');
    }
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
