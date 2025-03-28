import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import feather from 'feather-icons';
import { CommonService } from '../../../shared/services/common.service';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
})
export class FullComponent implements AfterViewInit ,OnInit {
  public loading: boolean = false;

  scriptUrls: string[] = [
    'assets/js/scrollbar/simplebar.js',
    'assets/js/scrollbar/custom.js',
    'assets/js/sidebar-menu.js',
  ];

  constructor( private identityService: IdentityService,public commonService: CommonService, private router: Router,private scriptLoader: ScriptLoaderService) {
    this.commonService.isLoading.subscribe({
      next: (response) => {
        if (response != null) {
          this.loading = response;
        }
      },
      error: (response: any) => {},
    });
  }
  ngOnInit(): void {
    this.scriptLoader
    .loadScript('assets/js/sidebar-menu.js')
    .then(() => {})
    .catch((error) => console.error(error)); 
  }

  ngAfterViewInit(): void {
    feather.replace(); // Ensure icons render
    this.scriptUrls.forEach((src) => this.addScript(src));
  }

  addScript(src: string): void {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}
