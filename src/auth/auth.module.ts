import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { JwtModule } from '../_common/jwt/jwt.module';

@Module({
  imports: [MemberModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
