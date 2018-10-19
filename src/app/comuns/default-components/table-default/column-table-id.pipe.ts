import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnTableId'
})
export class ColumnTableIdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let aux = value.split(args)
    if( aux.length > 1 ) {
      return aux[0]
    }
    return value
  }

}
