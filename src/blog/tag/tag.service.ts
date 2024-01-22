import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}
}
