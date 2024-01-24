import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberUpdateDto } from './member.dto';
import { Member } from 'src/_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Put()
  //todo guard 추가예정
  async update(@Member() member: IPayload, @Body() body: MemberUpdateDto) {
    return await this.memberService.update(member.id, body);
  }

  @Delete()
  //todo guard 추가예정
  async softDelete(@Member() member: IPayload) {
    return await this.memberService.softDelete(member.id);
  }

  @Get()
  //todo guard 추가예정
  async findUnique(@Member() member: IPayload) {
    return await this.memberService.findUnique(member.id);
  }
}
