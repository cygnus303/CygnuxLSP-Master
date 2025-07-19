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
} from '../../../shared/constants/common';
import { UserResponse } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';
import { RoleResponse } from '../../../shared/models/role.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { IdentityService } from '../../../shared/services/identity.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { LspService } from '../../../shared/services/lsp.service';

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
  public u_id: string = '';
  public isLoading = false;
  @Input() userResponse: UserResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  public selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private sweetAlertService: SweetAlertService,
    private roleService: RoleService,
    private identityService: IdentityService,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private lspService: LspService
  ) {
    this.userForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.getRoles();
  }

  buildForm(): void {
    this.userForm = new FormGroup({
      customerName: new FormControl(''),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null),
      location: new FormControl(''),
      sessionTime: new FormControl(1, [Validators.min(0), Validators.max(60)]),
      roles: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required, Validators.pattern(EmailRegex)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(OnlyDigitRegex)]),
      isActive: new FormControl(true),
      address: new FormControl('', [Validators.required]),
      locality: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl(null, [Validators.required, Validators.pattern(PincodeRegex)]),
      photo: new FormControl(''),
      userType: new FormControl('S')
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

  onClose() {
    this.buildForm();
    // this.dataEmitter.emit();
  }
  onSubmitUser(form: FormGroup): void {
    if (form.valid) {
      this.isLoading = true;
      !this.userId ? this.addUser(form) : this.updateUser(form);
    } else {
      this.isLoading = false;
      form.markAllAsTouched();
    }
  }
  getRoles() {
    const filters = {
      Page: 1,
      PageSize: 100
    }
    this.roleService.getRoleList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.roles = response.data;
          if (response && response.data) {
            this.roles = response.data.filter((role: any) => role.isActive && role.roleName !== 'SA');
          }
        }
      }
    });
  }

 addUser(form: FormGroup): void {
  if (form.invalid) {
    form.markAllAsTouched();
    return;
  }

  this.userService.addUser(this.identityService.getLoggedUserId(), form.getRawValue()).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response.data.status?.toString().includes('1')) {
        this.dataEmitter.emit();
        this.sweetAlertService.success(response.data.message);
        this.sendUsermail(response.data.id);
        this.u_id = response.data.id;

        const role = this.userForm.get('roles')?.value.toLowerCase();
        if (role === 'customer admin') {
          this.addCustomer();
        } else if (role === 'lsp admin') {
          this.addLsp();
        }
        this.userForm.reset();
        this.buildForm();
      } else {
        this.sweetAlertService.error(response.data.message);
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.sweetAlertService.error(err.error.message);
    },
  });
}

addCustomer(): void {
  const formValue = this.userForm.getRawValue();
  const payload = {
    ...formValue,
    u_Id: this.u_id,
    customerName: formValue.firstName,
    userType: 'C',
    mobileNo: formValue.phoneNumber,
    pincode: formValue.zipCode,
    country: 'INDIA'
  };

  const { phoneNumber, zipCode, ...finalPayload } = payload;

  this.customerService.addCustomer(finalPayload).subscribe({
    next: (response) => {
      if (response.success) {
        this.dataEmitter.emit();
        this.buildForm();
      } else {
        this.sweetAlertService.error(response.error.message);
      }
    },
    error: (err) => {
      this.sweetAlertService.error(err.error.message);
    },
  });
}

addLsp(): void {
  const formValue = this.userForm.getRawValue();
  const formData = new FormData();

  formData.append('customerName', formValue.customerName || '');
  formData.append('lspName', formValue.firstName);
  formData.append('lastName', formValue.lastName);
  formData.append('location', formValue.location || '');
  formData.append('sessionTime', formValue.sessionTime?.toString() || '0');
  formData.append('roles', formValue.roles);
  formData.append('emailId', formValue.emailId);
  formData.append('mobileNo', formValue.phoneNumber);
  formData.append('isActive', formValue.isActive ? 'true' : 'false');
  formData.append('address', formValue.address);
  formData.append('locality', formValue.locality || '');
  formData.append('city', formValue.city);
  formData.append('zipCode', formValue.zipCode);
  formData.append('userType', 'L');
  formData.append('photo', formValue.photo || '');
  formData.append('EntryBy', this.identityService.getLoggedUserId());
  formData.append('u_Id', this.u_id);

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  this.lspService.addLsp(formData).subscribe({
    next: (response) => {
      if (response.success) {
        // this.sweetAlertService.success(response.data.message);
        this.dataEmitter.emit();
        this.userForm.reset();
        this.onClose();
      } else {
        this.sweetAlertService.error(response.error.message);
      }
    },
    error: (err) => {
      this.sweetAlertService.error(err.error.message);
    },
  });
}

onFileChange(event: any): void {
  const file = event.target.files?.[0];
  if (!file) {
    this.selectedFile = null;
    return;
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (validTypes.includes(file.type)) {
    this.selectedFile = file;
  } else {
    this.selectedFile = null;
  }
}


  sendUsermail(id: any) {
    const filters = {
      userId: id
    }
    this.authenticationService.sendOTPMail(this.identityService.getLoggedUserId(), filters).subscribe({
      next: (response) => {
        if (response.success) {
          // this.sweetAlertService.success(response.data.message);
        } else {
          // this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        // this.sweetAlertService.error(response.error.message);
      },
    });
  }

  updateUser(form: FormGroup): void {
    this.userService.updateUser(this.userId, form.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading = false;
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
        this.isLoading = false;
        this.sweetAlertService.error(response.error.message);
      },
    });
  }
}
