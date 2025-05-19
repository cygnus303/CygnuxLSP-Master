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
  OnlyDigitRegex,
  PincodeRegex,
  zipCode,
} from '../../../shared/constants/common';
import { UserResponse } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';
import { RoleResponse } from '../../../shared/models/role.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { CustomerResponse } from '../../../shared/models/customer.model';

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
  public customers: CustomerResponse[] | null = null;
  @Input() userResponse: UserResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private sweetAlertService: SweetAlertService,
    private roleService: RoleService,
  ) {
    this.userForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.getRoles();
  }

  buildForm(): void {
    this.userForm = new FormGroup({
      customerName:new FormControl(null),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      location:new FormControl(''),
      sessionTime:new FormControl(null),
      roles: new FormControl('SA', [Validators.required]),
      emailId: new FormControl('', [Validators.required,Validators.pattern(EmailRegex)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(OnlyDigitRegex)]),
      isActive: new FormControl(true),
      address:new FormControl('',[Validators.required]),
      locality:new FormControl(''),
      city:new FormControl('',[Validators.required]),
      zipCode:new FormControl(null,[Validators.required,Validators.pattern(PincodeRegex)]),
      photo:new FormControl(''),
      userType:new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userResponse'] && this.userResponse) {
      // this.userResponse.userType = this.userResponse.roles
      this.userForm.patchValue(this.userResponse);
      this.userId = this.userResponse.id;
    } else {
      this.buildForm();
      this.userId = '';
    }
  }

  onClose(){
      // this.userForm.reset();
        this.buildForm();
        // this.dataEmitter.emit();
  }
  onSubmitUser(form: FormGroup): void {
    if (form.valid) {
      !this.userId ? this.addUser(form) : this.updateUser(form);
    }else{
      form.markAllAsTouched();
    }
  }
  getRoles() {
    this.roleService.getRoleList('',1, 100).subscribe({
      next: (response) => {
        if (response) {
          this.roles = response.data;
        if (response && response.data) {
          this.roles = response.data.filter((role: any) => role.isActive);
        }
      }}
    });
  }

  addUser(form: FormGroup): void {
    this.userService.addUser(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit();
          this.sweetAlertService.success(response.data.message);
          this.userForm.reset();
          this.buildForm();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  updateUser(form: FormGroup): void {
    this.userService.updateUser(this.userId, form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit();
          this.sweetAlertService.success(response.data.message);
          this.userForm.reset();
          this.buildForm();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
}
