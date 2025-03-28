import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
constructor(private commonService:CommonService){
  this.commonService.activeNavigationUrl.next('Dashboard');
}
}
