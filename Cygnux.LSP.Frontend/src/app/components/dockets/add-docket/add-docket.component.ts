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
import { ToastrService } from 'ngx-toastr';
import { DocketResponse } from '../../../shared/models/docket.model';
import { DocketService } from '../../../shared/services/docket.service';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';

@Component({
  selector: 'app-add-docket',
  standalone: false,
  templateUrl: './add-docket.component.html',
  styleUrls: ['./add-docket.component.scss'],
})
export class AddDocketComponent implements OnInit, OnChanges {
  public docketForm!: FormGroup;
  public docketId: string = '';
  public customers: CustomerResponse[] = [];
  @Input() docketResponse: DocketResponse | null = null;
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private docketService: DocketService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private lspTatService: LspMappingService
  ) {
    this.docketForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.docketId = '';
    this.getCustomers();
  }

  buildForm(): void {
    this.docketForm = new FormGroup({
      docketNo: new FormControl(null, [Validators.required]),
      bookingDate: new FormControl(null, [Validators.required]),
      fromLocation: new FormControl(null),
      toLocation: new FormControl(null),
      customerId: new FormControl(null),
      invoiceNo: new FormControl(null),
      transporter: new FormControl(null),
      transportMode: new FormControl(null),
      quantity: new FormControl(null),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['docketResponse'] && this.docketResponse) {
      this.docketForm.patchValue(this.docketResponse);
      this.docketId = this.docketResponse.id;
    } else {
      this.docketForm.reset();
      this.docketId = '';
    }
  }
  onSubmitDocket(form: FormGroup): void {
    if (form.valid) {
      !this.docketId ? this.addDocket(form) : this.updateDocket(form);
    }
  }
  getCustomers() {
    this.commonService.updateLoader(true);
    this.lspTatService.getCustomers().subscribe({
      next: (response) => {
        if (response) {
          this.customers = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  addDocket(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.docketService.addDocket(form.getRawValue()).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit(); // Emitting the data to the parent
          this.docketForm.reset();
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

  updateDocket(form: FormGroup): void {
    this.commonService.updateLoader(true);
    this.docketService
      .updateDocket(this.docketId, form.getRawValue())
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toasterService.success(response.data.message);
            this.dataEmitter.emit(); // Emitting the data to the parent
            this.docketForm.reset();
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
