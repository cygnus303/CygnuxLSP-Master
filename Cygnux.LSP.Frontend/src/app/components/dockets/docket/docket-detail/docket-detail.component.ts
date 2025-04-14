import { Component, Input } from '@angular/core';
import { DocketResponse } from '../../../../shared/models/docket.model';

@Component({
  selector: 'docket-detail',
  standalone: false,
  templateUrl: './docket-detail.component.html',
  styleUrl: './docket-detail.component.scss'
})
export class DocketDetailComponent {
  @Input() docketDetail: DocketResponse | null = null;

}
