import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IIpAndCountry, IRequest } from '../interfaces/request.interface';
import axios from 'axios';

export const IpAndCountry = createParamDecorator(async (data: unknown, ctx: ExecutionContext): Promise<IIpAndCountry> => {
  const request: IRequest = ctx.switchToHttp().getRequest();
  try {
    const res = await axios.get(`https://apis.data.go.kr/B551505/whois/ipas_country_code?serviceKey=${process.env.GET_REQ_IP_COUNTRY_KEY}&query=${request.ip}&answer=json`);
    return { ip: request.ip, country: res.data?.response?.whois?.countryCode };
  } catch (error) {
    return { ip: request.ip, country: 'error' };
  }
});
