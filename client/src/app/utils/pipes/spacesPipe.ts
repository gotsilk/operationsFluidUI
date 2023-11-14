import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'spaces'})
export class SpacesPipe implements PipeTransform{
  // @ts-ignore
  transform(value: any, ...args): any {
    if (typeof value !== 'string') {
      return value;
    }
    return value.split(/(?=[A-Z])/).join(' ');
  }
}
