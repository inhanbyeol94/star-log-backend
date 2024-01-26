import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from 'src/_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/types/payload.interface';
import { MemberUpdateDto } from './types/update/request.dto';
import { UserAuthGuard } from '../_common/_utils/guards/user.auth.guard';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Put('me')
  @UseGuards(UserAuthGuard)
  async update(@Member() member: IPayload, @Body() body: MemberUpdateDto) {
    return await this.memberService.update(member.id, body);
  }

  @Delete('me')
  @UseGuards(UserAuthGuard)
  async softDelete(@Member() member: IPayload) {
    return await this.memberService.softDelete(member.id);
  }

  @Get('me')
  @UseGuards(UserAuthGuard)
  async findUnique(@Member() member: IPayload) {
    return await this.memberService.findUnique(member.id);
  }
}
