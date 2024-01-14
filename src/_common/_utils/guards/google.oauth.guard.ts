import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IRequest } from '../interfaces/request.interface';
import { platform } from '@prisma/client';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: IRequest): Promise<any> {
    const code = req.query.code as string;
    console.log('code', code);
    if (!code) return false;

    try {
      const accessToken = await this.getOauthToken(code);
      console.log('accessToken', accessToken);
      const profile = await this.getProfile(accessToken);
      console.log('payload', profile);

      if (!profile) return false;

      const id = String(profile.id) || null;
      const profileImage = profile.picture || null;
      const email = profile.email || null;
      const nickname = profile.name || null;

      console.log('id,profileImage: ', id, profileImage);

      if (!id || !profileImage) return false;

      req.social = { id, profileImage, email, nickname, platform: platform.GOOGLE };

      return true;
    } catch (error) {
      return false;
    }
  }

  async getOauthToken(code: string) {
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        grant_type: 'authorization_code',
        client_id: this.configService.get('GOOGLE_CLIENT_ID'),
        redirect_uri: this.configService.get('GOOGLE_CALLBACK_URL'),
        client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
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
    const { data } = await axios.get(`https://www.googleapis.com/userinfo/v2/me?access_token=${accessToken}`);
    return data;
  }
}
