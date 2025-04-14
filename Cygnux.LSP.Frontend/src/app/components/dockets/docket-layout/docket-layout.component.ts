import { Component } from '@angular/core';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@Component({
  selector: 'app-docket-layout',
  standalone: false,
  templateUrl: './docket-layout.component.html',
  styleUrl: './docket-layout.component.scss'
})
export class DocketLayoutComponent {
constructor(){
  defineElement(lottie.loadAnimation);
}
}
