import { Component, Input } from '@angular/core';
import { CustomerResponse } from '../../../shared/models/customer.model';

@Component({
  selector: 'app-customer-detail',
  standalone: false,
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent {
  @Input() customerDetail: CustomerResponse | null = null;
}
