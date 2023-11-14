import {Directive, Input, ElementRef, OnInit} from '@angular/core';
import {ColumnStructureI} from '../../interfaces/commonInterfaces';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[suInputValidation]'
})
export class SuInputValidationDirective implements OnInit{


  @Input() colDetails!: ColumnStructureI;

  constructor(private eleRef: ElementRef) { }

  ngOnInit(): void {
    this.eleRef.nativeElement.style.width = '100%';

    // if (this.colDetails[validations.MAX_SIZE]){
    //   this.eleRef.nativeElement.setAttribute('maxLength',this.colDetails.maxsize)
    // }
    // if (this.colDetails[validations.NULLABLE]){
    //   this.eleRef.nativeElement.setAttribute('required','true')
    // }
    // if (this.colDetails[validations.MATCHES]){
    //   this.eleRef.nativeElement.setAttribute('pattern ',this.colDetails.pattern)
    // }
    // pattern


  }
}
