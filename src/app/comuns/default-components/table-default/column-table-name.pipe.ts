import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnTableName'
})
export class ColumnTableNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let aux = value.split(args)
    if( aux.length > 1 ) {
      return aux[1]
    }
    return value
  }

}
