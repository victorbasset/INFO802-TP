import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMinutesSeconds'
})
export class HoursMinutesSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const secs = value % 60;
    const secsString = (value % 60).toString().length == 1 ? '0'+ value % 60 : value % 60;
    value = (value - secs) / 60;
    const mins = value % 60;
    const minsString = (value % 60).toString().length == 1 ? '0'+ value % 60 : value % 60;
    const hrsString = ((value - mins) / 60).toString().length == 1 ? '0'+ (value - mins) / 60 : (value - mins) / 60;

    return hrsString + ':' + minsString + ':' + secsString;
  }

}
