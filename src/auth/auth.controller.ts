import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from '../_common/_utils/guards/naver.oauth.guard';
import { Social } from '../_common/_utils/decorators/social.decorator';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from '../_common/_utils/guards/google.oauth.guard';
import { Member } from '../_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';
import { AccessToken } from '../_common/_utils/decorators/access-token.decorator';
import { AuthHistoryPaginationDto } from './auth-history/auth-history.dto';
import { IpAndCountry } from '../_common/_utils/decorators/ip-and-country.decorator';
import { IIpAndCountry } from '../_common/_utils/interfaces/request.interface';
import { KakaoAuthGuard } from '../_common/_utils/guards/kakao.oauth.guard';
import { ISocial } from './interfaces/social.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Delete()
  async logout(@Member() member: IPayload, @AccessToken() accessToken: string, @IpAndCountry() ipAndCountry: IIpAndCountry): Promise<string> {
    return await this.authService.logout(member.id, accessToken, ipAndCountry);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naver(@Social() social: ISocial, @IpAndCountry() ipAndCountry: IIpAndCountry): Promise<string> {
    return await this.authService.oAuthLogin(social, ipAndCountry);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async google(@Social() social: ISocial, @IpAndCountry() ipAndCountry: IIpAndCountry): Promise<string> {
    return await this.authService.oAuthLogin(social, ipAndCountry);
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakao(@Social() social: ISocial, @IpAndCountry() ipAndCountry: IIpAndCountry): Promise<string> {
    return await this.authService.oAuthLogin(social, ipAndCountry);
  }

  @Get('histories/me')
  async historyFindManyAndCount(@Member() member: IPayload, @Query() query: AuthHistoryPaginationDto) {
    return await this.authService.historyFindManyAndCount(member.id, query);
  }
}
