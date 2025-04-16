import { Component, AfterViewInit } from '@angular/core';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import feather from 'feather-icons';

@Component({
  selector: 'app-docket-layout',
  templateUrl: './docket-layout.component.html',
  styleUrl: './docket-layout.component.scss'
})
export class DocketLayoutComponent implements AfterViewInit {
  constructor() {
    defineElement(lottie.loadAnimation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    feather.replace();
  }
}
