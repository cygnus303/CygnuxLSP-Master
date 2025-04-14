import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-status-list',
  standalone: false,
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.scss'
})
export class StatusListComponent {
constructor(){defineElement(lottie.loadAnimation)}

openStatusUpdateModal(){
  const modalElement = document.getElementById('showModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
}


downloadSampleFile(event:any){
  event.preventDefault();
  let path =
    environment.apiUrl.replace('/api/v1', '') + 'Uploads/Status_Import.xlsx';
  window.open(path, '_blank');
}

}
