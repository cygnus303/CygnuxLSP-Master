import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full/full.component';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CustomerModule } from '../customers/customers.module';
import { LspModule } from '../lsps/lsps.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    declarations: [
        FullComponent,
        HeaderComponent,
        FooterComponent,
        ChangePasswordComponent,
    ],
    providers: [],
    exports: [
        FullComponent
    ],
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        CustomerModule,
        LspModule,
        ReactiveFormsModule
    ]
})
export class LayoutModule { }
