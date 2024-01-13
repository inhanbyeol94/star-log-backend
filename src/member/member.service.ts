import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Member, PrismaClient } from '@prisma/client';
import { RedisService } from '../_common/redis/redis.service';
import { MemberRepository } from './member.repository';
import { IUpdateUser } from './member.interface';
import { JwtService } from '../_common/jwt/jwt.service';
import { ISocial } from '../auth/auth.interface';

const prisma = new PrismaClient();

@Injectable()
export class MemberService {
  constructor(
    private redisService: RedisService,
    private memberRepository: MemberRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * **멤버 업데이트 API**
   * @remarks 업데이트 성공 시 변경 된 데이터로 토큰을 재반환
   * @param id string
   * @param data
   * @param data.[email] string
   * @param data.[nickname] string
   * @param data.[phoneNumber] string
   * @param data.[profileImage] string
   * @param data.[globalAccess] boolean
   * @throws {NotFoundException} 유저 데이터 없음
   * @throws {ConflictException} 사용중인 닉네임
   * @return {string} accessToken
   * */
  async update(id: string, data: IUpdateUser): Promise<string> {
    await this.isValidById(id);
    await this.existsNickname(id, data.nickname);
    const member = await this.memberRepository.update(id, data);
    const accessToken = this.jwtService.sign(member);
    //레디스에서 토큰 교체 필요
    return accessToken;
  }

  /**
   * **멤버 탈퇴 API**
   * @param id string
   * @throws {NotFoundException} 유저 데이터 없음
   * */
  async delete(id: string): Promise<string> {
    await this.isValidById(id);
    await Promise.all([this.memberRepository.delete(id) /* 레디스 토큰 삭제 필요 */]);
    return '탈퇴가 완료되었습니다.';
  }

  /**
   * **멤버 단일조회 API**
   * @param {string} id string
   * @throws {NotFoundException}
   * @return Member Schema
   * */
  async findFirstById(id: string): Promise<Member> {
    return await this.isValidById(id);
  }

  /**
   * **멤버 단일조회 및 유효성 검증**
   * @param {string} id string
   * @throws {NotFoundException}
   * @return Member Schema
   * */
  async isValidById(id: string): Promise<Member> {
    const member = await this.memberRepository.findFirstById(id);
    if (!member) throw new NotFoundException('존재하지 않는 멤버입니다.');
    return member;
  }

  /**
   * **멤버 소셜 아이디 기준 단일조회**
   * @param socialId number
   * @return Member Schema
   * */
  async findFirstBySocialId(socialId: string): Promise<Member> {
    return await this.memberRepository.findFirstBySocialId(socialId);
  }

  /**
   * **닉네임 중복 검사**
   * @param id
   * @param nickname
   * @throws {ConflictException}
   * @return void
   * */
  async existsNickname(id: string, nickname: string): Promise<void> {
    const member = await this.memberRepository.findFirstByNickname(nickname);
    if (member && member.id !== id) throw new ConflictException('이미 사용중인 닉네임입니다.');
  }

  /**
   * 멤버 생성
   * */
  async create(data: ISocial): Promise<Member> {
    return await this.memberRepository.create({ socialId: data.id, profileImage: data.profileImage, platform: data.platform });
  }

  /**
   * **벤 추가**
   * @param {number} memberId 사용자 ID
   * @param {string} reason 이유
   * @param {date} limitedAt limitedAt
   * @return boolean
   */
  async setBanned(memberId: string, reason: string, limitedAt: Date): Promise<boolean> {
    await Promise.all([this.memberRepository.setBanned(memberId, reason, limitedAt), this.redisService.setBanedMember(memberId)]);
    return true;
  }

  /**
   * **벤 삭제**
   * @param {number} memberId 사용자 ID
   * @return boolean
   */
  async deleteBanned(memberId: string): Promise<boolean> {
    const member = await this.findBannedMemberById(memberId);
    await Promise.all([this.memberRepository.deleteBanned(member.id), this.redisService.deleteBanedMember(memberId)]);
    return true;
  }

  /**
   * **멤버 찾기**
   * @param {number} memberId 사용자 ID
   * @return Member
   */
  async findBannedMemberById(memberId: string) {
    return await this.memberRepository.findFirstBanned(memberId);
  }
}
