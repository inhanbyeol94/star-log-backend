import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IRequest } from '../interfaces/request.interface';
import { JwtService } from '../../jwt/jwt.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: IRequest): Promise<boolean> {
    const accessToken = req.headers.authorization;
    if (!accessToken) return false;

    const payload = this.jwtService.verify(accessToken);
    if (typeof payload === 'string') throw new UnauthorizedException(payload);
    if (!payload.isAdmin) throw new ForbiddenException('접근 권한이 없습니다.');
    const sessions = await this.redisService.accessTokenFindMany(payload.id);
    if (!sessions.includes(accessToken)) return false;

    req.member = payload;

    return true;
  }
}
