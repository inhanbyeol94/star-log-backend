import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class SharedService {
  static getDate() {
    return DateTime.now().setZone('Asia/Seoul').toFormat('yyyy-MM-dd HH:mm:ss');
  }
}
