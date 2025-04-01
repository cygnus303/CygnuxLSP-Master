import { Component } from '@angular/core';

@Component({
  selector: 'app-import-docket',
  standalone: false,
  templateUrl: './import-docket.component.html',
  styleUrl: './import-docket.component.scss'
})
export class ImportDocketComponent {
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
}
