import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IRequest } from '../interfaces/request.interface';
import { platform } from '@prisma/client';

@Injectable()
export class NaverAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: IRequest): Promise<any> {
    const code = req.query.code as string;
    if (!code) return false;

    try {
      const accessToken = await this.getOauthToken(code);
      const profile = await this.getProfile(accessToken);

      if (!profile) return false;

      const id = String(profile.response?.id) || null;
      const profileImage = profile.response?.profile_image || null;

      if (!id || !profileImage) return false;

      req.social = { id, profileImage, platform: platform.NAVER };

      return true;
    } catch (error) {
      return false;
    }
  }

  async getOauthToken(code: string) {
    const { data } = await axios.post(
      'https://nid.naver.com/oauth2.0/token',
      {
        grant_type: 'authorization_code',
        client_id: this.configService.get('NAVER_CLIENT_ID'),
        redirect_uri: this.configService.get('NAVER_CALLBACK_URL'),
        client_secret: this.configService.get('NAVER_CLIENT_SECRET'),
        state: 'star-log',
        code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          charset: 'UTF-8',
        },
      },
    );
    return data.access_token;
  }

  async getProfile(accessToken: string) {
    const { data } = await axios.get(`https://openapi.naver.com/v1/nid/me?access_token=${accessToken}`);
    return data;
  }
}
