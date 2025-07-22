import { Component } from '@angular/core';
import { IdentityService } from '../../../shared/services/identity.service';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import * as XLSX from 'xlsx';
import { ValidateFileResponse } from '../../../shared/models/docket.model';

@Component({
  selector: 'app-import-lsp-tat',
  standalone: false,
  templateUrl: './import-lsp-tat.component.html',
  styleUrl: './import-lsp-tat.component.scss'
})
export class ImportLspTatComponent {
  public files: File[] = [];
  public selectedFile: any;
  public loading: boolean = false;
  public validateData: ValidateFileResponse[] = [];


  constructor(
    private identityService: IdentityService,
    private lspMappingservice: LspMappingService,
    private sweetAlertService: SweetAlertService
  ) { }

  downloadSampleFile(event: any) {
    event.preventDefault();
    // this.isLoadingTemplate = true;
    this.lspMappingservice.downloadSampleLspTat().subscribe({
      next: (response: Blob) => {
        // this.isLoadingTemplate = false;
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'LspTatUpload.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        // this.isLoadingTemplate = false;
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
      const isValidType = validExcelTypes.includes(file.type);
      const isValidName = fileName.toLowerCase().startsWith('lsptatupload');

      if (isValidType && isValidName) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });

          const expectedColumns = [
            'customername',
            'lspname',
            'product',
            'origin',
            // 'origin state',
            'destination',
            'destinationState',
            'priority',
            'bookingType',
            'mode',
            'tat',
            // 'rate per kg',
          ].map(col => col.toLowerCase());

          const uploadedColumns = (sheetData[0] as string[]).map(col => col.toLowerCase().trim());
          const allColumnsPresent = expectedColumns.every(
            col => uploadedColumns.includes(col)
          );

          if (allColumnsPresent) {
            this.files = [file];
            this.selectedFile = file;
          } else {
            this.sweetAlertService.error(
              'Invalid file format. Please upload a file with all required columns.'
            );
            this.files = [];
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        this.sweetAlertService.error('Please upload a valid Excel file starting with "LspTatUpload".');
        this.files = [];
      }
    }
  }

  onRemoveFile(file: File) {
    this.files = this.files.filter(f => f !== file);
    // this.validateData = [];
  }

  uploadLspTatFile() {
    const formData = new FormData();
    this.loading = true;
    formData.append('file', this.selectedFile);
    this.lspMappingservice.validateLspTatdata(formData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.data) {
          this.validateData = response.data;
          const invalidData = this.validateData
            .filter(item => item.errorCode)
            .map(({ customer, ...rest }) => rest);

          if (invalidData.length > 0) {
            // this.lspMappingservice.importInvalidFile(invalidData, 'LspTat');
          }
        }
      },
      error: (response: any) => {
        this.loading = false;
        this.sweetAlertService.error(response.error.Message);
      },
    });
  }
}
