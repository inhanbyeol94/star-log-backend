import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class SharedService {
  static getDate(zone = 'Asia/Seoul', format = 'YYYY-MM-DD HH:mm:ss') {
    if (zone == 'utc') {
      return moment().utc().format(format);
    }
    return moment().tz(zone).format(format);
  }
}
