import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IRequest } from '../interfaces/request.interface';
import { platform } from '@prisma/client';

@Injectable()
export class KakaoAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: IRequest): Promise<boolean> {
    const code = req.query.code as string;
    console.log('code', code);
    if (!code) return false;

    try {
      const accessToken = await this.getOauthToken(code);
      console.log('accessToken', accessToken);
      const profile = await this.getProfile(accessToken);
      console.log('profile', profile);

      if (!profile) return false;

      const id = String(profile.id) || null;
      console.log('id', id);
      const profileImage = profile.properties.profile_image || null;
      console.log('profileImage', profileImage);

      if (!id || !profileImage) return false;

      req.social = { id, profileImage, platform: platform.KAKAO };
      console.log('req.social', req.social);

      return true;
    } catch (error) {
      return false;
    }
  }

  async getOauthToken(code: string) {
    const { data } = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: this.configService.get('KAKAO_CLIENT_ID'),
        redirect_uri: this.configService.get('KAKAO_CALLBACK_URL'),
        client_secret: this.configService.get('KAKAO_CLIENT_SECRET'),
        state: 'starlog',
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
    const { data } = await axios.get(`https://kapi.kakao.com/v2/user/me?access_token=${accessToken}`);
    return data;
  }
}
