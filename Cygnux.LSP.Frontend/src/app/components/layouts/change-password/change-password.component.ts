import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  providers:[BsModalService]
})
export class ChangePasswordComponent {
  private modalRef!: BsModalRef;
  public passform!:FormGroup;
  showChangePassword = false;

  @ViewChild('Changepassword', { static: true }) Changepassword!: TemplateRef<any>;
  constructor(private modalService: BsModalService){}

  showpopup(){
    this.modalRef = this.modalService.show(this.Changepassword, { backdrop: true, ignoreBackdropClick: false, class: 'password-bgcolor' });
  }
}
