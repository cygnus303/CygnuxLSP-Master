import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  success(message:string){
    Swal.fire({
      title: message,
      icon: "success",
      draggable: true
    });
    Swal.fire({
      title: message,
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: '#171829',
      customClass: {
        container: 'notification-popup'
      }
    });
  }

  delete(message:string, onConfirm: () => void){
    Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#171829',
    cancelButtonColor: '#aaa',
    customClass: {
      container: 'notification-popup'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm(); // 🔥 call the actual delete function
    }
  });
  }

   cancel(message:string, onConfirm: () => void){
    Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel!',
    cancelButtonText: 'No',
    confirmButtonColor: '#171829',
    cancelButtonColor: '#aaa',
    customClass: {
      container: 'notification-popup'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm(); // 🔥 call the actual delete function
    }
  });
  }

  error(message:any){
    Swal.fire({
      icon: "error",
      text: message
    });
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: '#171829',
      customClass: {
        container: 'notification-popup'
      }
    });
  }
}
