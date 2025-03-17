import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../shared/services/role.service';
import { CommonService } from '../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { RoleResponse } from '../../../shared/models/role.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-add-role',
  standalone: false,
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit, OnChanges {
  public roleForm!: FormGroup;
  public roleId: string = '';
  @Input() roleResponse: RoleResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private roleService: RoleService,
    private commonService: CommonService,
    private toasterService: ToastrService
  ) {
    this.roleForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.roleForm = new FormGroup({
      roleName: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roleResponse'] && this.roleResponse) {
      this.roleForm.patchValue(this.roleResponse);
      this.roleId = this.roleResponse.id;
    } else {
      this.roleForm.reset();
      this.roleId = '';
    }
  }
  onSubmitRole(form: FormGroup): void {
    if (form.valid) {
      !this.roleId ? this.addRole(form) : this.updateRole(form);
    }
  }

  addRole(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.roleService.addRole(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.roleForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  updateRole(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.roleService.updateRole(this.roleId, form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.roleForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
}
