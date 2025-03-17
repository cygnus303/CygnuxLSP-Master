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
import { CustomerService } from '../../../shared/services/customer.service';
import { CommonService } from '../../../shared/services/common.service';
import {
  EmailRegex,
  GSTRegex,
  OnlyDigitRegex,
} from '../../../shared/constants/common';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { CustomerResponse } from '../../../shared/models/customer.model';

@Component({
  selector: 'app-add-customer',
  standalone: false,
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit, OnChanges {
  public customerForm!: FormGroup;
  public customerCode: string = '';
  @Input() customerResponse: CustomerResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private customerService: CustomerService,
    private commonService: CommonService,
    private toasterService: ToastrService
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
      emailId: new FormControl(null, [
        Validators.required,
        Validators.pattern(EmailRegex),
      ]),
      address: new FormControl(null, [Validators.required]),
      pincode: new FormControl(null, [
        Validators.required,
        Validators.pattern(OnlyDigitRegex),
      ]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
      isAllowedForEwayBillGenration: new FormControl(false),
      isConsolidatedGSTNo: new FormControl(false),
      consolidatedGSTNo: new FormControl(null, [
        Validators.required,
        Validators.pattern(GSTRegex),
      ]),
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
  onSubmitCustomer(form: FormGroup): void {
    if (form.valid) {
      !this.customerCode ? this.addCustomer(form) : this.updateCustomer(form);
    }
  }

  addCustomer(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.customerService.addCustomer(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit(); // Emitting the data to the parent
          this.customerForm.reset();
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

  updateCustomer(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.customerService
      .updateCustomer(this.customerCode, form.getRawValue())
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.success(response.data.message);
            this.dataEmitter.emit(); // Emitting the data to the parent
            this.customerForm.reset();
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
