import { Component, EventEmitter, Output } from '@angular/core';
import { SweetAlertService } from '../../../../shared/services/toastr.service';
import { DocketService } from '../../../../shared/services/docket.service';
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
  public selectedFile: any;
  public validateData: ValidateFileResponse[] = [];
  public isLoadingTemplate:boolean = false;
  public loading:boolean = false;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor(private sweetAlertService: SweetAlertService, private docketService: DocketService, private identityService: IdentityService) { }

  downloadSampleFile(event: any) {
    event.preventDefault();
    this.isLoadingTemplate=true;
    this.docketService.downloadSampleDocketUpload(this.identityService.getLoggedUserId()).subscribe({
      next: (response: Blob) => {
        this.isLoadingTemplate=false;
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'DocketUpload.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.isLoadingTemplate=false;
        this.sweetAlertService.error('No Lsp found for customer.');
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

      const fileName = file.name;

      // Validate file type
      const isValidType = validExcelTypes.includes(file.type);

      // Validate file name starts with "DocketUpload"
      const isValidName = fileName.toLowerCase().startsWith('docketupload');

      if (isValidType && isValidName) {
        this.files = [file];
        this.selectedFile = file;
      } else {
        this.sweetAlertService.error('Please upload a valid Excel file starting with "DocketUpload".');
        this.files = [];
      }
    }
  }

  get isValidData(): boolean {
    return this.validateData.length > 0 && this.validateData.every(item => !item.errorCode);
  }

  onRemoveFile(file: File) {
    this.files = this.files.filter(f => f !== file);
    this.validateData = [];
  }

uploadDocketFile() {
  const formData = new FormData();
  this.loading = true;
  formData.append('file', this.selectedFile);
  this.docketService.validateDocketList(this.identityService.getLoggedUserId(), formData).subscribe({
    next: (response) => {
      if (response && response.data) {
        this.loading = false;
        this.validateData = response.data;
        this.docketService.importInvalidFile(this.validateData, 'Invalid_Dockets  ');
      }
    },
    error: (response: any) => {
      this.loading = false;
      this.sweetAlertService.error(response.error.Message);
    },
  });
}

  onClose() {
    this.validateData = [];
    this.files = [];
  }

  onSave() {
    const transformedList = this.validateData.map(({ lsp, errorMessage, errorCode, date, customer, ...rest }) => ({
      ...rest, bookingDate: date, customerId: customer, lspId: lsp, remarks: "", isCancel: false
    }));
    this.docketService.InsertExcelUplaodDocketData(this.identityService.getLoggedUserId(), transformedList).subscribe({
      next: (response) => {
        if (response.success) {
          this.validateData = [];
          this.files = [];
          this.dataEmitter.emit()
          this.sweetAlertService.success(response.data.message);
        } else {
          this.sweetAlertService.error(response.data.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.data.message);
      },
    });
  }
}