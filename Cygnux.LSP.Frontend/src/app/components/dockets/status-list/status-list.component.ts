import { Component } from '@angular/core';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { DocketService } from '../../../shared/services/docket.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';
import { ValidateDocketStatusList } from '../../../shared/models/docket.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status-list',
  standalone: false,
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.scss'
})
export class StatusListComponent {
  public files: File[] = [];
  public selectedFile: any;
  public validateDocketStatusList: ValidateDocketStatusList[] = [];
  public loading:boolean = false;
  public isLoadingTemplate:boolean = false;
  constructor(
    private sweetAlertService: SweetAlertService,
    public docketService: DocketService,
    public commonService: CommonService,
    private identityService: IdentityService,
    private router: Router
  ) {
    defineElement(lottie.loadAnimation)
  }

  downloadSampleFile(event: any) {
    event.preventDefault();
    this.isLoadingTemplate=true;
    this.docketService.downloadSampleStatusUpload(this.identityService.getLoggedUserId()).subscribe({
      next: (response: Blob) => {
        this.isLoadingTemplate=false;
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'DocketStatusUpload.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.isLoadingTemplate=false;
        this.sweetAlertService.error('Failed to download file.');
      }
    });
  }

  onChangeFile(event: any) {
    this.validateDocketStatusList = [];
    const file = event.addedFiles[0];
    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ];

      const fileName = file.name.toLowerCase();
      const isValidType = validExcelTypes.includes(file.type);
      const isValidName = fileName.startsWith('docketstatusupload');

      if (isValidType && isValidName) {
        this.files = [file];
        this.selectedFile = file;
      } else {
        this.sweetAlertService.error('Please upload a valid Excel file starting with "DocketStatusUpload".');
        this.files = [];
        this.selectedFile = null;
      }
    }
  }


  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    this.validateDocketStatusList = [];
  }

  get isValidData(): boolean {
    return this.validateDocketStatusList.length > 0 && this.validateDocketStatusList.every(item => item.errorCode === 1);
  }

  exportExcel() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.loading = true;
    this.docketService.validateDocketStatus(this.identityService.getLoggedUserId(), formData).subscribe({
      next: (response) => {
        this.validateDocketStatusList = response.data;
        this.loading = false;
        const cleanedData = this.validateDocketStatusList.map((item: any) => {
          const formattedDate = new Date(item.statusDate).toLocaleDateString('en-US');
          const {
            docketNumber,
            nextDocketStatus,
            customerName,
            lspName,
            errorMessage
          } = item;

          return {
            docketNumber,
            nextDocketStatus,
            customerName,
            lspName,
            statusDate: formattedDate,
            errorMessage: errorMessage || 'Success' // If empty, set as 'Success'
          };
        });
        this.docketService.StatusInvalidFile(cleanedData, 'Invalid_Dockets');
      },
      error: (error) => {
         this.loading = false;
        this.sweetAlertService.error(error);
      }
    });
  }

  onSave(){
    this.commonService.updateLoader(true)
    this.docketService.updateDocketStatus(this.identityService.getLoggedUserId(), this.validateDocketStatusList).subscribe({
      next: (response) => {
        if (response.success) {
          this.files = [];
          this.validateDocketStatusList = [];
          this.sweetAlertService.success(response.data.message);
          this.router.navigateByUrl('docket/list');
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
