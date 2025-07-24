import { Component, EventEmitter, Output } from '@angular/core';
import { IdentityService } from '../../../shared/services/identity.service';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import * as XLSX from 'xlsx';
import { validateFileResponse } from '../../../shared/models/lsp-tat.model';
import { ExportService } from '../../../shared/services/export.service';

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
  public isLoadingTemplate: boolean = false;
  public validateData: validateFileResponse[] = [];
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    private identityService: IdentityService,
    private lspMappingservice: LspMappingService,
    private sweetAlertService: SweetAlertService,
    private exportService: ExportService
  ) { }

  downloadSampleFile(event: any) {
    event.preventDefault();
    this.isLoadingTemplate = true;
    this.lspMappingservice.downloadSampleLspTat(this.identityService.getLoggedUserId()).subscribe({
      next: (response: Blob) => {
        this.isLoadingTemplate = false;
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
        this.isLoadingTemplate = false;
        this.sweetAlertService.error('No Lsp found for customer.');
      }
    });
  }

  onChangeFile(event: any) {
    this.validateData = [];
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
            'destination',
            'priority',
            'bookingType',
            'mode',
            'tat',
            'RateperKG',
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
  get isValidData(): boolean {
    return this.validateData.length > 0 && this.validateData.some(item => item.errorCode === 1);
  }
  onRemoveFile(file: File) {
    this.files = this.files.filter(f => f !== file);
    this.validateData = [];
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
          console.log(this.validateData)
          const invalidRecords = this.validateData.filter(item => item.errorCode === 0);

          // ✅ Export invalid records with error messages
          if (invalidRecords.length > 0) {
            this.exportService.exportInvalidTatData(invalidRecords, 'Invalid_LSP_TAT');
          }
        }
      },
      error: (response: any) => {
        this.loading = false;
        this.sweetAlertService.error(response.error.Message);
      },
    });
  }

  onClose() {
    this.files = [];
    this.validateData = [];
  }

  onSave() {
    const validRecords = this.validateData
      .filter(x => x.errorCode === 1)
      .map(item => ({
        ...item,
        id: null,
        isActive: true,
        priority: item.priority.toString().trim()
      }));

    this.lspMappingservice.insertExcelLspTatData(this.identityService.getLoggedUserId(), validRecords).subscribe({
      next: (response) => {
        if (response.success) {
          this.validateData = [];
          this.files = [];
          this.dataEmitter.emit();
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
