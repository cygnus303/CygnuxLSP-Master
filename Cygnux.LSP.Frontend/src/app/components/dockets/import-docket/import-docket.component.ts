import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-docket',
  standalone: false,
  templateUrl: './import-docket.component.html',
  styleUrl: './import-docket.component.scss'
})
export class ImportDocketComponent {
  excelData: any[][] = [];
  ngOnInit(){}
  files: File[] = [];

  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onClose(){
    this.files =[]
  }


  exportExcel() {
    if (!this.files || this.files.length === 0) {
      alert("Please select an Excel file first.");
      return;
    }
  
    let file = this.files[0]; // Get the first selected file
    let reader = new FileReader();
  
    reader.onload = (e: any) => {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: 'array' });
  
      let sheetName = workbook.SheetNames[0]; 
      let sheet = workbook.Sheets[sheetName];
  
      let jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      this.processImagePaths(jsonData);
    };
  
    reader.readAsArrayBuffer(file);
  }
  
  processImagePaths(data: any[][]) {
    debugger
    console.log("Full Excel Data:", data);
  
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let cellValue = data[i][j] ? String(data[i][j]).trim() : "";
        console.log(`Checking Cell [${i}, ${j}]:`, cellValue);
  
        if (cellValue.includes('G:\\') || cellValue.includes('G:/')) {
          console.log("Sending to backend for binary conversion:", cellValue);
  
          this.convertImagePathToBinary(cellValue).then((binaryData: Uint8Array) => {
            console.log("Received Binary Data:", binaryData);
            data[i][j] = binaryData;  // Replace local path with binary
          });
        }
      }
    }
  
    this.excelData = data;
  }
  
  
  convertImagePathToBinary(imagePath: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5000/api/image-to-binary', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: imagePath }) // Send local path to backend
      })
      .then(response => response.arrayBuffer())
      .then(buffer => resolve(new Uint8Array(buffer)))
      .catch(error => reject(error));
    });
  }
  
  
  convertToBase64(file: File): Promise<string> {
    debugger
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  
  isImage(value: string): boolean {
    debugger
    return value.startsWith('data:image/');
  }
  

}
