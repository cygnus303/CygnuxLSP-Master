import { Component, EventEmitter, Output } from '@angular/core';
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
  excelData: any[] = [];
  files: File[] = [];
  mappedData: any[] = [];
  uploadedImages: any[] = [];
  selectedFile: File | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private docketService:DocketService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService
  ){}

  ngOnInit(){}
  
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
    if (this.selectedFile === file) {
      this.selectedFile = null;
    }
  }
  
  onClose(){
    this.files = [];
    this.excelData = []
  }

  onDropzoneSelect(event: any) {
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
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet); // using header row
          this.excelData = jsonData;
          this.tryMapExcelToImages();
        };
        reader.readAsArrayBuffer(file);
      } else {
        this.sweetAlertService.error('Please upload a valid excel file.');
        this.selectedFile = null;
        this.files = [];
        this.excelData = [];
      }
    }
  }
 
  onRemoveimg(file: any) {
    const index = this.uploadedImages.findIndex(img => img.name === file.name);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
      this.tryMapExcelToImages(); // Re-map after removal
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
    this.tryMapExcelToImages()
  }

  tryMapExcelToImages() {
    if (!this.excelData?.length || !this.uploadedImages?.length) {
      this.mappedData = [];
      return;
    }
    this.mappedData = this.excelData.map((row: any) => {
      const docketNo = row['DocketNo'];
      const matchedImage = this.uploadedImages.find(img =>
        img.name.toLowerCase().includes(docketNo?.toString().toLowerCase())
      );
      return {
        DocketNo: docketNo,
        UploadDate: this.excelDateToJSDate(row['UploadDate']), // Converts Excel date to "dd-MM-yyyy"
        ImageLink: matchedImage?.name || null,
        file: matchedImage?.file || null
      };
    });
    console.log('✅ Final Mapped Data:', this.mappedData);
  }
  

  excelDateToJSDate(serial: number): string {
    const excelEpoch = new Date(1899, 11, 30); 
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  extractFileName(fullPath: string): string {
    return fullPath.split('\\').pop()?.split('/').pop() || '';
  }

  exportExcel(){
    this.docketService.UploadDocket(this.identityService.getLoggedUserId(),this.mappedData).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit()
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