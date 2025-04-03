import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

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
      confirmButtonColor: '#3f7473',
      customClass: {
        container: 'notification-popup'
      }
    });
  }

  delete(){
    Swal.fire({
      title: "Patient has a Planned Admission, no services can be added!",
      icon: 'warning',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: '#3f7473',
      customClass: {
        container: 'notification-popup'
      }
    }).then((result) => {

    });
  }

  error(message:any){
    Swal.fire({
      icon: "error",
      text: message
    });
    Swal.fire({
      icon: 'error',
      title: 'Employee ID Already Exists',
      text: message,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: '#3f7473',
      customClass: {
        container: 'notification-popup'
      }
    });
  }
}
