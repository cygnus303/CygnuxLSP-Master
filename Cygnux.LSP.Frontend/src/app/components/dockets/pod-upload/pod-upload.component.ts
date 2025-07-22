import { Component, EventEmitter, Output } from '@angular/core';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { ValidDatePOD } from '../../../shared/models/docket.model';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
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
  public validDate: ValidDatePOD[] = []
  public loading: boolean = false;
  public loadingexportExcel: boolean = false;
  public isLoadingTemplate: boolean = false;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private docketService: DocketService,
    private identityService: IdentityService,
    private sweetAlertService: SweetAlertService,
    private router: Router
  ) { }

  ngOnInit() { }

  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    if (this.selectedFile === file) {
      this.selectedFile = null;
    }
    this.selectedFile = null;
    this.mappedData = [];
    this.uploadedImages = [];
  }

  onClose() {
    this.files = [];
    this.mappedData = [];
    this.selectedFile = null;
    this.uploadedImages = [];
  }

  // onDropzoneSelect(event: any) {
  //   const file = event.addedFiles[0];
  //   if (!file) return;

  //   const validExcelTypes = [
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     'application/vnd.ms-excel',
  //     'text/csv',
  //   ];

  //   const fileName = file.name.toLowerCase();
  //   const isValidType = validExcelTypes.includes(file.type);
  //   const isValidName = fileName.startsWith('docketpodupload');

  //   if (!isValidType || !isValidName) {
  //     this.sweetAlertService.error('Please upload a valid Excel file starting with "DocketPODUpload".');
  //     this.resetFileSelection();
  //     return;
  //   }

  //   this.files = [file];
  //   this.selectedFile = file;
  // }


onDropzoneSelect(event: any) {
  const file = event.addedFiles[0];
  if (!file) return;

  const validExcelTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];

  const isValidType = validExcelTypes.includes(file.type);

  if (!isValidType) {
    this.sweetAlertService.error('Invalid file type. Please upload a valid Excel or CSV file.');
    this.resetFileSelection();
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });

    const expectedColumns = ['docketno', 'uploaddate'].map(col => col.toLowerCase());
    const uploadedColumns = (sheetData[0] as string[]).map(col => col.toLowerCase().trim());
    const allColumnsPresent = expectedColumns.every(col => uploadedColumns.includes(col));

    if (allColumnsPresent) {
      this.files = [file];
      this.selectedFile = file;
    } else {
      this.sweetAlertService.error('Invalid file format. Please Upload Valid File.');
      this.resetFileSelection();
    }
  };
  reader.readAsArrayBuffer(file);
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
    for (let i = 0; i < files.length; i++) {
      this.uploadedImages.push({
        name: files[i].name,
        file: files[i]
      });
    }
  }

  exportExcel() {
    this.loadingexportExcel = true;
    const formData = new FormData();
    this.uploadedImages.forEach((item) => {
      if (item.file) {
        formData.append('imgfiles', item.file, item.name);
      }
    });
    formData.append('docketJson', JSON.stringify(this.mappedData));
    formData.append('User', this.identityService.getLoggedUserId());
    this.docketService.uploadDocket(formData).subscribe({
      next: (response) => {
        this.loadingexportExcel = false;
        if (response.success) {
          this.dataEmitter.emit();
          this.files = [];
          this.mappedData = [];
          this.uploadedImages = [];
          this.sweetAlertService.success(response.data.message);
          this.router.navigateByUrl('docket/list');
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.loadingexportExcel = false
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
    this.loading = true;
    this.docketService.validatePOD(this.identityService.getLoggedUserId(), formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.mappedData = response.data
          this.loading = false;
          this.dataEmitter.emit();
          // this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: () => {
        this.loading = false;
        this.sweetAlertService.error('Failed to upload data.');
      }
    });
  }

  downloadSampleFile(event: any) {
    event.preventDefault();
    this.isLoadingTemplate = true;
    this.docketService.DownloadSampleForPODupload(this.identityService.getLoggedUserId()).subscribe({
      next: (response: Blob) => {
        this.isLoadingTemplate = false;
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
        this.isLoadingTemplate = false;
        this.sweetAlertService.error('Failed to download file.');
      }
    });
  }
}
