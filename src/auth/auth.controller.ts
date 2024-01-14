import { Controller, Delete, Get, Ip, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from '../_common/_utils/guards/naver.oauth.guard';
import { Social } from '../_common/_utils/decorators/social.decorator';
import { ISocial } from './auth.interface';
import { AuthService } from './auth.service';
import { Member } from '../_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';
import { AccessToken } from '../_common/_utils/decorators/access-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Delete()
  async logout(@Member() member: IPayload, @AccessToken() accessToken: string) {
    return await this.authService.logout(member.id, accessToken);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naver(@Social() social: ISocial, @Ip() ip: string) {
    return await this.authService.oAuthLogin(social, ip);
  }
}
