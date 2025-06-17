import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IdentityService } from '../../../shared/services/identity.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
 
@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  providers:[BsModalService]
})
export class ChangePasswordComponent {
  @ViewChild('Changepassword', { static: true }) Changepassword!: TemplateRef<any>;
  public modalRef!: BsModalRef;
  public changePasswordForm:FormGroup;
  public showChangePassword = false;
  public isCurrentVisible = false;
  public isPasswordVisible = false;
  public isConfirmVisible = false;

  constructor(private modalService: BsModalService,private identityService:IdentityService,private authenticationService:AuthenticationService,private sweetAlertService: SweetAlertService){
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [  Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  showpopup(){
    this.modalRef = this.modalService.show(this.Changepassword, { backdrop: true, ignoreBackdropClick: false, class: 'password-bgcolor' });
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      const body = {oldPassword,newPassword,userId:this.identityService.getLoggedUserId()};
      
      this.authenticationService.ChangePassword(body).subscribe({next: (response) => {
          if (response) {
          this.sweetAlertService.success(response.data.message);
          this.modalRef.hide();
          }
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.error.message);
        },
      });
    }
  }

 toggleVisibility(field: 'current' | 'new' | 'confirm'): void {
    if (field === 'current') this.isCurrentVisible = !this.isCurrentVisible;
    else if (field === 'new') this.isPasswordVisible = !this.isPasswordVisible;
    else if (field === 'confirm') this.isConfirmVisible = !this.isConfirmVisible;
  }
}
