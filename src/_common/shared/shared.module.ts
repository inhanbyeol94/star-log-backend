import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';

@Module({ imports: [SharedService], providers: [SharedService] })
export class SharedModule {}
