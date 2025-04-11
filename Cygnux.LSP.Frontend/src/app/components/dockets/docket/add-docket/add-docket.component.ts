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
import { CustomerResponse } from '../../../../shared/models/customer.model';
import { DocketResponse } from '../../../../shared/models/docket.model';
import { CommonService } from '../../../../shared/services/common.service';
import { DocketService } from '../../../../shared/services/docket.service';
import { IdentityService } from '../../../../shared/services/identity.service';
import { LspMappingService } from '../../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../../shared/services/toastr.service';


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
    private sweetAlertService: SweetAlertService,
    private lspTatService: LspMappingService,
    private identityService:IdentityService
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
      bookingDate: new FormControl(new Date(), [Validators.required]),
      fromLocation: new FormControl(null),
      toLocation: new FormControl(null),
      customerId: new FormControl(null),
      invoiceNo: new FormControl(null),
      transporter: new FormControl(null),
      transportMode: new FormControl(null),
      quantity: new FormControl(null),
      EntryBy  :new FormControl(this.identityService.getLoggedUserId())
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['docketResponse'] && this.docketResponse) {
      this.docketResponse.bookingDate = new Date(this.docketResponse.bookingDate)
      this.docketForm.patchValue(this.docketResponse);
      this.docketId = this.docketResponse.id;
    } else {
      this.docketForm.reset();
      this.docketId = '';
      this.docketForm.patchValue({
        bookingDate:new Date()
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }

  onClose(){
    this.docketForm.reset();
    this.buildForm();
    this.dataEmitter.emit();
  }

  onSubmitDocket(form: FormGroup): void {
    if (form.valid) {
      let forms = {
        ...form.value,
        EntryBy:this.identityService.getLoggedUserId(),
        bookingDate:form.value.bookingDate.toISOString().split('T')[0]
      }
      !this.docketId ? this.addDocket(forms) : this.updateDocket(forms);
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
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  addDocket(form: any): void {
    this.commonService.updateLoader(true);
    this.docketService.addDocket(form).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit(); // Emitting the data to the parent
          this.docketForm.reset();
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

  updateDocket(form: any): void {
    this.commonService.updateLoader(true);
    this.docketService
      .updateDocket(this.docketId, form)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.sweetAlertService.success(response.data.message);
            this.dataEmitter.emit(); // Emitting the data to the parent
            this.docketForm.reset();
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
