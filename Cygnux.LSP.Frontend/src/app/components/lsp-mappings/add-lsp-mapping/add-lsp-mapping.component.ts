import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import { IdentityService } from '../../../shared/services/identity.service';
import { LspService } from '../../../shared/services/lsp.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { LspMappingService } from '../../../shared/services/lsp-mapping.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { LspResponse } from '../../../shared/models/lsp.model';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';

@Component({
  selector: 'app-add-lsp-mapping',
  templateUrl: './add-lsp-mapping.component.html',
  styleUrls: ['./add-lsp-mapping.component.scss'],
})
export class AddLspMappingComponent {
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  public customers: CustomerResponse[] = [];
  public lsps: LspResponse[] = [];
  public lspMappingsList: LspMappingResponse[] = [];
  unmappedCustomers: any[] = []; // or give the correct type if you know it


  public mappedCustomerLspMap: { [key: string]: string[] } = {};
  public selectedCustomer: CustomerResponse | null = null;
  public lspMappingId: string = '';
  public isEditMode = false;
  public isActive: boolean = true;
  public showCustomerSearch = false;
  public showMappedSearch = false;
  public showAvailableSearch = false;

  @Input() lspMappingResponse: LspMappingResponse | null = null;

  constructor(
    private customerService: CustomerService,
    private lspService: LspService,
    private lspMappingService: LspMappingService,
    private identityService: IdentityService,
    private sweetAlertService: SweetAlertService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspMappingResponse'] && this.lspMappingResponse) {
      this.lspMappingResponse.lspIds = this.lspMappingResponse.lspId
        ? this.lspMappingResponse.lspId.split(',').map(id => id.trim())
        : [];

      this.lspMappingId = this.lspMappingResponse.lspMappingId ?? '';
      this.isEditMode = true;
      this.loadData();
    } else {
      this.lspMappingId = '';
      this.isEditMode = false;
      this.selectedCustomer = null;
      this.loadData();
    }
  }

  loadData() {
    this.getLspMappings();
    this.getCustomers();
    this.getLsps();
  }

  toggleSearch(type: string) {
    if(!this.showAvailableSearch){
      this.sweetAlertService.error('Please selected Customer')
    }
    if (type === 'customer') this.showCustomerSearch = !this.showCustomerSearch;
    else if (type === 'mapped') this.showMappedSearch = !this.showMappedSearch;
    else if (type === 'available') this.showAvailableSearch = !this.showAvailableSearch;
  }

  getCustomers() {
    const filters = { Page: 1, PageSize: 100 };
    this.customerService.getCustomerList(this.identityService.getLoggedUserId(), filters).subscribe({
      next: (res) => {
        if (this.lspMappingResponse?.customerId) {
          this.customers = res.data.filter(c => c.customerId === this.lspMappingResponse?.customerId);
          this.selectedCustomer = this.customers[0] ?? null;
        } else {
          this.customers = res.data;
        }
        this.categorizeCustomers();
      },
      error: (err) => this.sweetAlertService.error(err.error.message)
    });
  }

  getLsps() {
    const filters = { Page: 1, PageSize: 100 };
    this.lspService.getLspList(this.identityService.getLoggedUserId(), filters).subscribe({
      next: (res) => {
        this.lsps = res.data;
        this.categorizeCustomers();
      },
      error: (err) => this.sweetAlertService.error(err.error.message)
    });
  }

  getLspMappings() {
    const filters = { Page: 1, PageSize: 500 };
    this.lspMappingService.getLspMappingList(this.identityService.getLoggedUserId(), filters).subscribe({
      next: (res) => {
        this.lspMappingsList = res.data;
        this.categorizeCustomers();
      }
    });
  }

  categorizeCustomers() {
    const mappedIds = this.lspMappingsList.map(m => m.customerId);
    this.customers = this.customers || [];
     this.unmappedCustomers = !this.lspMappingId ? this.customers.filter(c => !mappedIds.includes(c.customerId)) : this.customers.filter(c => mappedIds.includes(c.customerId));

    this.mappedCustomerLspMap = {};
    for (const mapping of this.lspMappingsList) {
      const customerId = mapping.customerId;
      if (!this.mappedCustomerLspMap[customerId]) {
        this.mappedCustomerLspMap[customerId] = [];
      }

      const lspIds = mapping.lspId?.split(',') || [];
      lspIds.forEach(id => {
        const lsp = this.lsps.find(l => l.lspId === id.trim());
        if (lsp && !this.mappedCustomerLspMap[customerId].includes(lsp.lspName)) {
          this.mappedCustomerLspMap[customerId].push(lsp.lspName);
        }
      });
    }
  }

  selectCustomer(customer: CustomerResponse) {
    this.selectedCustomer = customer;
    this.mappedCustomerLspMap={}
  }

  toggleLspSelection(lsp: LspResponse) {
    if (!this.selectedCustomer) {
      this.sweetAlertService.info('Please select a customer first to proceed with LSP selection.');
      return;
    };
    const customerId = this.selectedCustomer.customerId;
    if (!this.mappedCustomerLspMap[customerId]) {
      this.mappedCustomerLspMap[customerId] = [];
    }
    const mapped = this.mappedCustomerLspMap[customerId];
    if (!mapped.includes(lsp.lspName)) {
      mapped.push(lsp.lspName);
    }
  }

  toggleMappedLspSelection(lspName: string) {
    if (!this.selectedCustomer) return;
    const customerId = this.selectedCustomer.customerId;
    const list = this.mappedCustomerLspMap[customerId];
    if (list) {
      const index = list.indexOf(lspName);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
  }

  get availableLsps(): LspResponse[] {
    if (!this.selectedCustomer) return this.lsps;
    const mappedNames = this.mappedCustomerLspMap[this.selectedCustomer.customerId] || [];
    return this.lsps.filter(lsp => !mappedNames.includes(lsp.lspName));
  }

  onSave() {
    if (!this.selectedCustomer) {
      this.sweetAlertService.info('Please select a customer.');
      return;
    }

    const customerId = this.selectedCustomer.customerId;
    const mappedLspNames = this.mappedCustomerLspMap[customerId] || [];
    if (mappedLspNames.length === 0) {
      this.sweetAlertService.info('Please map at least one LSP.');
      return;
    }

    const mappedLspIds: string[] = [];
    mappedLspNames.forEach(name => {
      const lsp = this.lsps.find(l => l.lspName === name);
      if (lsp) {
        mappedLspIds.push(lsp.lspId);
      }
    });

    const payload = {
      customerId: customerId,
      LspId: mappedLspIds.join(','),
      UserId: this.identityService.getLoggedUserId(),
      CreatedBy: this.identityService.getLoggedUserId(),
      updatedBy: this.identityService.getLoggedUserId(),
      isActive: this.isActive
    };

    if (!this.lspMappingId) {
      this.addLspMapping(payload);
    } else {
      this.updateLspMapping(payload);
    }
  }

  addLspMapping(dataSubmit: any) {
    this.lspMappingService.addLspMapping(dataSubmit).subscribe({
      next: (res) => {
        if (res.data.status.toString() === '1') {
          this.sweetAlertService.success('Mapping saved successfully.');
          this.dataEmitter.emit();
          this.selectedCustomer = null;
          this.loadData();
        } else {
          this.sweetAlertService.error(res.data.message);
        }
      },
      error: (err) => this.sweetAlertService.error(err.error.message)
    });
  }

  updateLspMapping(dataSubmit: any) {
    this.lspMappingService.updateLspMapping(this.lspMappingResponse?.lspMappingId, dataSubmit).subscribe({
      next: (response) => {
        if (response.data.status.toString() === '1') {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
        } else {
          this.sweetAlertService.error(response.data.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.data.message);
      },
    });
  }

  onClose() {
    this.dataEmitter.emit();
    this.selectedCustomer = null;
    this.mappedCustomerLspMap = {};
    this.lspMappingResponse = null;
    this.isEditMode = false;
  }
}
