import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ChangeDiffI, CompareModalDataI} from '../../interfaces/commonInterfaces';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-compare-modal',
  templateUrl: './compare-modal.component.html',
  styleUrls: ['./compare-modal.component.css']
})
export class CompareModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: CompareModalDataI, private datePipe: DatePipe) { }


  changes: ChangeDiffI[] = [];

  ngOnInit(): void {
    const oldVal = this.data.originalModel;
    const newVal = this.data.newModel;
    for (const field in oldVal){
       if (oldVal.hasOwnProperty(field)){
         let original = oldVal[field];
         let destination = newVal[field];

         // for the relations
         if (original && original.hasOwnProperty('id')){
           original = original.id;
         }

         if (original instanceof Array){
           if (original.length > 0 && original[0].hasOwnProperty('id')){
             const originalExtract: any[] = [];
             original.forEach((item) => {
               originalExtract.push(item.id);
             });
             original = originalExtract;
           }
         }

         if (destination instanceof Array){
           if (destination.length > 0 && destination[0].hasOwnProperty('id')){
             const destExtract: any[] = [];
             destination.forEach((item) => {
               destExtract.push(item.id);
             });
             destination = destExtract;
           }
         }

         // handling relationships / sets / and other oddities
         if ((destination === undefined) ||
           (original == null && destination === false) ||
           (original == null && destination === '')){
           continue;
         }

         if (original !== destination){
           // make this not null
           const dataType = this?.data?.dataModel?.cols?.find(col =>  col?.columnName === field)?.columnType;
           if (dataType === 'boolean' && original === null) {
             original = false;
           }

           if (dataType === 'date'){
             let ogDateVal = null;
             let destDateVal = null;
             if (original) {
               ogDateVal = original.getTime();
             }
             if (destination){
               destDateVal = destination.getTime();
             }
             if (ogDateVal === destDateVal){
               continue;
             }

             if (destination instanceof Date){
               destination = this.datePipe.transform(destination, 'medium');
             }

             if (original instanceof Date){
               original = this.datePipe.transform(original, 'medium');
             }
           }

           this.changes.push({
             field,
             newVal: destination,
             oldVal: original
           });
         }
       }
     }
  }

}
