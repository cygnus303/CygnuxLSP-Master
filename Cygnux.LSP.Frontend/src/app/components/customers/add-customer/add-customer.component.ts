import {Component,EventEmitter,Input,OnChanges,OnInit,Output,SimpleChanges} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../shared/services/customer.service';
import { CommonService } from '../../../shared/services/common.service';
import {EmailRegex,GSTRegex, MobileRegex,OnlyDigitRegex} from '../../../shared/constants/common';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { IdentityService } from '../../../shared/services/identity.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit, OnChanges {
  public customerForm!: FormGroup;
  public customerCode: string = '';
  public customers: CustomerResponse[] | null = null;
  public userId :string | null = null;

  @Input() customerResponse: CustomerResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private customerService: CustomerService,
    private commonService: CommonService,
    private sweetAlertService: SweetAlertService,
    private identityService:IdentityService,
    private userService:UserService
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
        emailId: new FormControl(null, [Validators.required,Validators.pattern(EmailRegex)]),
        address: new FormControl(null, [Validators.required]),
        pincode: new FormControl(null, [Validators.required,Validators.pattern(OnlyDigitRegex)]),
        city: new FormControl(null, [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        isActive: new FormControl(true),   
        isAllowedForEwayBillGenration: new FormControl(false),
        isConsolidatedGSTNo: new FormControl(false),
        consolidatedGSTNo: new FormControl(''),
        isConsolidatedGSTEnabled: new FormControl(false),
        country:new FormControl('INDIA'),
        purchaseHead:new FormControl(''),
        purchaseHeadMobileNo:new FormControl(''),
        accountsHead:new FormControl(''), 
        accountsHeadMobileNo:new FormControl(''), 
        proprietorName:new FormControl(''),
        proprietorMobileNo:new FormControl(''),
        proprietorEmail:new FormControl(''),
        userId: new FormControl(this.identityService.getLoggedUserId()),
        updatedBy: new FormControl(this.identityService.getLoggedUserId()),
        createdBy: new FormControl(this.identityService.getLoggedUserId()),
        firstName:new FormControl('',[Validators.required]),
        lastName:new FormControl('', [Validators.required]),
        mobileNo:new FormControl('',[Validators.required, Validators.pattern(MobileRegex)]),
        roles:new FormControl('customer Admin')
      });
    }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerResponse'] && this.customerResponse) {
      this.customerForm.patchValue(this.customerResponse);
      this.customerCode = this.customerResponse.customerCode;
    } else {
      this.customerForm.reset();
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

  onClose(){
    this.customerForm.reset();
    this.buildForm();
    this.dataEmitter.emit();
  }

  onSubmitCustomer(form: FormGroup): void {
    if (form.valid) {
      // !this.customerCode ? this.addCustomer(form) : this.updateCustomer(form);
      !this.customerCode ? this.addUser(form) : this.updateCustomer(form);

    }
  }

  addUser(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.userService.addUser(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataEmitter.emit();
          // this.sweetAlertService.success(response.data.message);
          this.userId=response.data.id;
          this.addCustomer(form)
          // this.buildForm();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  addCustomer(form: FormGroup): void {
    this.commonService.updateLoader(true);
    const formValues = { ...this.customerForm.value, u_Id: this.userId };
    const { firstName, lastName, mobileNo, roles, ...payload } = formValues;
    this.customerService.addCustomer(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit(); // Emitting the data to the parent
          this.customerForm.reset();
          this.buildForm();
          this.getCustomers();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  getCustomers() {
    this.commonService.updateLoader(true);
    const filters: any = {
      Page: 1,
      UserID:this.identityService.getLoggedUserId(),
      PageSize: 100,
    };
    this.customerService.getCustomerList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  updateCustomer(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.customerService
      .updateCustomer(this.customerCode, form.getRawValue())
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sweetAlertService.success(response.data.message);
            this.dataEmitter.emit(); // Emitting the data to the parent
            this.customerForm.reset();
            this.buildForm();
          } else {
            this.sweetAlertService.error(response.error.message);
          }
          this.commonService.updateLoader(false);
        },
        error: (response: any) => {
          this.sweetAlertService.error(response.error.message);
          this.commonService.updateLoader(false);
        },
      });
  }
}
