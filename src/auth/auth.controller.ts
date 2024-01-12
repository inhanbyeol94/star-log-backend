import { Controller, Get, Ip, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from '../_common/_utils/guards/naver.oauth.guard';
import { Social } from '../_common/_utils/decorators/social.decorator';
import { ISocial } from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naver(@Social() social: ISocial, @Ip() ip: string) {
    return await this.authService.oAuthLogin(social, ip);
  }
}
