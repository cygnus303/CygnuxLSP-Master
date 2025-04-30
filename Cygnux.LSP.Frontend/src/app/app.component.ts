import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from './components/layouts/layout.module';
import { CommonService } from './shared/services/common.service';
declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cygnux.LSP.Frontend';
  public loading: string = 'disable';


  constructor(public commonService: CommonService){
    this.commonService.isLoading.subscribe({
      next: (response) => {
        setTimeout(()=>{
          if (response != null) {
            this.loading = response ? 'enable' : 'disable';
          }
        },500)
      },
      error: (response: any) => {},
    });
  }
}