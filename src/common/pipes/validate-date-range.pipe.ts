import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

@Injectable()
export class ValidateDateRangePipe implements PipeTransform {
  constructor(
    private readonly startDateKey: string = 'checkInDate',
    private readonly endDateKey: string = 'checkOutDate',
  ) { }

  transform(args: any) {
    const startDate = args[this.startDateKey] as Date;
    const endDate = args[this.endDateKey] as Date;
    if (!startDate || !endDate) {
      throw new BadRequestException(
        `Both ${this.startDateKey} and ${this.endDateKey} are required.`,
      );
    }

    if (startDate.getTime() > endDate.getTime()) {
      throw new BadRequestException(
        `${this.startDateKey} must be before ${this.endDateKey}.`,
      );
    }

    return args;
  }
}
