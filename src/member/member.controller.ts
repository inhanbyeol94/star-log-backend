import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { UpdateMemberDto } from './member.dto';
import { Member } from 'src/_common/_utils/decorators/member.decorator';
import { IPayload } from '../_common/jwt/jwt.interface';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Put()
  //guard 추가예정
  async update(@Member() member: IPayload, @Body() body: UpdateMemberDto) {
    return await this.memberService.update(member.id, body);
  }

  @Delete()
  //guard 추가예정
  async delete(@Member() member: IPayload) {
    return await this.memberService.delete(member.id);
  }

  @Get()
  //guard 추가예정
  async findFirst(@Member() member: IPayload) {
    return await this.memberService.findFirstById(member.id);
  }
}
