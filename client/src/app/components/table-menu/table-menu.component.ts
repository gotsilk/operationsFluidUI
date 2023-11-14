import {Component, Input, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss']
})
export class TableMenuComponent {

  @Input()model!: MenuItem[];
  @Input()activeItem!: any;
  @Input()hideHeaders!: any;
  @Output()hideHeadersChange = new EventEmitter<boolean>();
  link: any;

  constructor(){ }

  headerClick(): void{
    this.hideHeadersChange.emit(false);
  }
}
