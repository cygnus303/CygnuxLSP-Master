import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-update',
  standalone: false,
  templateUrl: './status-update.component.html',
  styleUrl: './status-update.component.scss'
})
export class StatusUpdateComponent {
  statusUpdateForm!:FormGroup;

  ngOnInit(){
    this.buildForm();
  }

  buildForm(){
    this.statusUpdateForm=new FormGroup({
      docketNumber: new FormControl(null,[Validators.required]),
      lspName:new FormControl(null), 
      orderDate:new FormControl(null),
      statusDate:new FormControl(null),
      fromCity:new FormControl(null),
      toCity:new FormControl(null),
      currentStatus:new FormControl(null),
      changeStatus:new FormControl(null),
      pod:new FormControl(null)
    })
  }
}
