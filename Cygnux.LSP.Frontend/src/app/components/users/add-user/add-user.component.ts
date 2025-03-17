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
import { CommonService } from '../../../shared/services/common.service';
import {
  EmailRegex,
  GSTRegex,
  OnlyDigitRegex,
} from '../../../shared/constants/common';
import { ToastrService } from 'ngx-toastr';
import { UserResponse } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';
import { RoleResponse } from '../../../shared/models/role.model';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, OnChanges {
  public userForm!: FormGroup;
  public userId: string = '';
  public roles: RoleResponse[] = [];
  @Input() userResponse: UserResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private roleService: RoleService
  ) {
    this.userForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.getRoles();
  }

  buildForm(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      roles: new FormControl([], [Validators.required]),
      emailId: new FormControl(null, [
        Validators.required,
        Validators.pattern(EmailRegex),
      ]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(OnlyDigitRegex),
      ]),
      isActive: new FormControl(true),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userResponse'] && this.userResponse) {
      this.userForm.patchValue(this.userResponse);
      this.userId = this.userResponse.id;
    } else {
      this.userForm.reset();
      this.userId = '';
    }
  }
  onSubmitUser(form: FormGroup): void {
    if (form.valid) {
      !this.userId ? this.addUser(form) : this.updateUser(form);
    }
  }
  getRoles() {
    this.commonService.updateLoader(true);
    this.roleService.getRoleList().subscribe({
      next: (response) => {
        if (response) {
          this.roles = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  addUser(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.userService.addUser(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit();
          this.toasterService.success(response.data.message);
          this.userForm.reset();
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

  updateUser(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.userService.updateUser(this.userId, form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit();
          this.toasterService.success(response.data.message);
          this.userForm.reset();
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
