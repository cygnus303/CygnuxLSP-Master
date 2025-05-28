import { Component, Input } from '@angular/core';
import { DocketResponse } from '../../../../shared/models/docket.model';

@Component({
  selector: 'docket-detail',
  standalone: false,
  templateUrl: './docket-detail.component.html',
  styleUrl: './docket-detail.component.scss'
})
export class DocketDetailComponent {
  public showPodImage : boolean = false;
  public userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  @Input() docketDetail: DocketResponse | null = null;
  

 openPodModal() {
    this.showPodImage = true;
  }

  closePodModal() {
    this.showPodImage = false;
  }
}
