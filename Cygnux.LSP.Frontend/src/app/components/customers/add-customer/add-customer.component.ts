import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../shared/services/customer.service';
import { EmailRegex, GSTRegex, mobileNo, MobileRegex, OnlyDigitRegex } from '../../../shared/constants/common';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { UserService } from '../../../shared/services/user.service';
import { concatMap, throwError } from 'rxjs';
import { IdentityService } from '../../../shared/services/identity.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit, OnChanges {
  public customerForm!: FormGroup;
  public customerCode: string = '';
  public customerId: string = '';
  public userId: string | null = null;

  @Input() customerResponse: CustomerResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private customerService: CustomerService,
    private sweetAlertService: SweetAlertService,
    private userService: UserService,
    private identityService: IdentityService,
    private authenticationService: AuthenticationService
  ) {
    this.customerForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.customerCode = '';
  }

  buildForm(): void {
    this.customerForm = new FormGroup({
      customerName: new FormControl(null, [Validators.required]),
      emailId: new FormControl(null, [Validators.required, Validators.pattern(EmailRegex)]),
      address: new FormControl(null, [Validators.required]),
      pincode: new FormControl(null, [Validators.required, Validators.pattern(OnlyDigitRegex)]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
      isAllowedForEwayBillGenration: new FormControl(false),
      isConsolidatedGSTNo: new FormControl(false),
      consolidatedGSTNo: new FormControl(''),
      isConsolidatedGSTEnabled: new FormControl(false),
      country: new FormControl('INDIA'),
      purchaseHead: new FormControl(''),
      purchaseHeadMobileNo: new FormControl('', Validators.pattern(mobileNo)),
      accountsHead: new FormControl(''),
      accountsHeadMobileNo: new FormControl('', Validators.pattern(mobileNo)),
      proprietorName: new FormControl(''),
      proprietorMobileNo: new FormControl('', Validators.pattern(mobileNo)),
      proprietorEmail: new FormControl('', Validators.pattern(EmailRegex)),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required, Validators.pattern(MobileRegex)]),
      roles: new FormControl('customer Admin'),
      customerCode: new FormControl(''),
      userType: new FormControl('C')
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerResponse'] && this.customerResponse) {
      this.customerForm.patchValue(this.customerResponse);
      this.customerCode = this.customerResponse.customerCode;
      this.customerId = this.customerResponse.customerId;
    } else {
      this.buildForm();
      this.customerCode = '';
    }
  }

  onToggleGSTNo() {
    const control = this.customerForm.get('consolidatedGSTNo')!;
    if (this.customerForm.get('isConsolidatedGSTEnabled')?.value) {
      control.setValidators([
        Validators.required,
        Validators.pattern(GSTRegex),
      ]);
    } else {
      control.clearValidators();
      control.setValue('');
    }
    control.updateValueAndValidity();
  }

  onClose() {
    this.buildForm();
    // this.dataEmitter.emit();
  }

  onSubmitCustomer(form: FormGroup): void {
    if (form.valid) {
      !this.customerCode ? this.addUserAndCustomer(form) : this.updateCustomer(form);
    } else {
      form.markAllAsTouched();
    }
  }

  addUserAndCustomer(form: FormGroup): void {
    if (form.valid) {
      const { accountsHead, accountsHeadMobileNo, consolidatedGSTNo, country,
        isAllowedForEwayBillGenration, isConsolidatedGSTEnabled, isConsolidatedGSTNo, mobileNo, pincode,
        proprietorEmail, proprietorMobileNo, proprietorName, purchaseHead, purchaseHeadMobileNo, state, customerCode, ...payload } = form.getRawValue();
      payload.phoneNumber = mobileNo;
      payload.zipCode = pincode;
      this.userService.addUser(this.identityService.getLoggedUserId(), payload).pipe(
        concatMap((userResponse) => {
          if (userResponse.success) {
            this.userId = userResponse.data.id;
            this.sendUsermail(userResponse.data.id)
            const formValues = { ...form.getRawValue(), u_Id: this.userId };
            const { roles, ...customerPayload } = formValues;
            const currentUserId = this.identityService.getLoggedUserId();
            customerPayload.userId = currentUserId
            customerPayload.updatedBy = currentUserId
            customerPayload.createdBy = currentUserId
            customerPayload.entryBy = currentUserId
            return this.customerService.addCustomer(customerPayload);
          } else {
            this.sweetAlertService.error(userResponse.error.message);
            return throwError(() => new Error('User creation failed'));
          }
        })
      ).subscribe({
        next: (customerResponse) => {
          if (customerResponse.success) {
            this.sweetAlertService.success(customerResponse.data.message);
            this.dataEmitter.emit();
            this.buildForm();
          } else {
            this.sweetAlertService.error(customerResponse.error.message);
          }
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.error.message);
        }
      });
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


  updateCustomer(form: FormGroup): void {
    const currentUserId = this.identityService.getLoggedUserId();
    const formValues = { ...form.getRawValue(), userId: currentUserId, updatedBy: currentUserId, createdBy: currentUserId, entryBy: currentUserId, };
    this.customerService.updateCustomer(this.customerCode, formValues).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit(); // Emitting the data to the parent
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

  isActiveChecked(event: any) {
    const isChecked = event.target.checked;
    const customerId = this.customerId;

    if (!customerId) return;

    if (!isChecked) {
      this.customerService.CheckedCustomer(customerId).subscribe({
        next: (response) => {
            this.sweetAlertService.info(response.data[0].message);
            this.customerForm.get('isActive')?.setValue(true, { emitEvent: false });
        },
        error: (error) => {
          this.sweetAlertService.error(error?.message || 'Something went wrong while checking mapping.');
        }
      });
    } 
  }
}
