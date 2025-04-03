import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import feather from 'feather-icons';
@Component({
  selector: 'app-track-trace',
  standalone: false,
  templateUrl: './track-trace.component.html',
  styleUrl: './track-trace.component.scss'
})
export class TrackTraceComponent {
  status = "in-transit";
  constructor( public commonService: CommonService){
    defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Track Trace');
  }
  docketInput: string = '';
  docketList: string[] = [];

  docketnumber=[
    {"docketNumber":"ABC123"},
    {"docketNumber":"ABC123"},
    {"docketNumber":"ABC123"},

  ]
  addDocketNumber(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim();

    if (event.key === ',' && value) {
      const docketNumber = value.slice(0, -1); // Remove the trailing comma
      if (docketNumber) {
        this.docketList.push(docketNumber);
        inputElement.value = ''; // Clear input after adding
      }
    }
  }
  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
  }
  removeDocket(docket: string): void {
    this.docketList = this.docketList.filter(d => d !== docket);
  }
}
