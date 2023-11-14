import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';


@Component({
  selector: 'app-valigator-modal',
  templateUrl: './valigator-modal.component.html',
  styleUrls: ['./valigator-modal.component.scss']
})
export class ValigatorModalComponent implements OnInit {

  constructor( public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {}

}
