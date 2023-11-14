import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl,  FormGroup} from '@angular/forms';
import {ColumnStructureI} from '../../interfaces/commonInterfaces';

@Component({
  selector: 'form-error-message',
  templateUrl: './form-error-message.component.html',
  styleUrls: ['./form-error-message.component.scss']
})
export class FormErrorMessageComponent implements OnInit{
  init: boolean;
  @Input() form!: FormGroup;
  @Input() col!: ColumnStructureI;
  control !: AbstractControl;

  constructor() {
    this.init = false;
  }

  ngOnInit(): void {
    this.control = this.form.controls[this.col.columnName];
    this.init = true;
  }
}
