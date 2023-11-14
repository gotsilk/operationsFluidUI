import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent{

  canCancel!: boolean;
  msg: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.canCancel){
      this.canCancel = data.canCancel;
    }
    this.msg = data.msg;
  }
}
