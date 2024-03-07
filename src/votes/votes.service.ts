// vote.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async create(
    messageId: number,
    createVoteDto: CreateVoteDto,
    { userId },
  ): Promise<Vote> {
    // Get user message vote and upsert vote up or down
    let vote = await this.findByUserAndMessage(userId, messageId);
    const { voteUp } = createVoteDto;
    if (!vote) {
      vote = this.voteRepository.create({
        user: { id: userId },
        message: { id: messageId },
      });
    }
    vote.voteUp = voteUp;

    return await this.voteRepository.save(vote);
  }

  async findByUserAndMessage(
    userId: number,
    messageId: number,
  ): Promise<Vote | undefined> {
    try {
      // Get user message vote
      const vote = await this.voteRepository.findOne({
        where: {
          user: { id: userId },
          message: { id: messageId },
        },
      });
      return vote;
    } catch (error) {
      console.error('Error finding vote:', error);
      return null;
    }
  }
}
