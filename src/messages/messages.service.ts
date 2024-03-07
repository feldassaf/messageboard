import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Vote } from '../votes/entities/vote.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async create(createMessageDto: CreateMessageDto, { userId }) {
    // Create new message
    try {
      const newMessage = await this.messageRepository.create({
        ...createMessageDto,
        author: { id: userId },
      });
      return await this.messageRepository.save(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      return null;
    }
  }

  async delete(messageId: number) {
    // Delete existing message
    try {
      const message = await this.messageRepository.findOne({
        where: { id: messageId },
        relations: ['votes'],
      });
      await this.voteRepository.remove(message.votes);
      return await this.messageRepository.remove(message);
    } catch (error) {
      console.error('Error deleteing message:', error);
      return null;
    }
  }

  async isMessageAuthor(messageId: number, userId: number): Promise<boolean> {
    try {
      // Check if a user is the message author
      const message = await this.messageRepository.findOne({
        where: {
          id: messageId,
          author: { id: userId },
        },
      });

      return !!message;
    } catch (error) {
      console.error('Error checking if the use is message author:', error);
      return null;
    }
  }

  async findAllWithVoteCounts(userId: number = null): Promise<any[]> {
    try {
      // Get messages with author from the user table and votes count
      const queryBuilder = this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.votes', 'vote')
        .leftJoinAndSelect('message.author', 'user')
        .select([
          'message.id as message_id',
          'message.title',
          'message.content',
          'message.created_at',
          'message.updated_at',
          'message.is_active',
          "CONCAT(user.firstName, ' ', user.lastName) as author",
        ])
        .addSelect(
          'SUM(CASE WHEN vote.voteUp = true THEN 1 ELSE 0 END)',
          'upVotes',
        )
        .addSelect(
          'SUM(CASE WHEN vote.voteUp = false THEN 1 ELSE 0 END)',
          'downVotes',
        )
        .groupBy(
          'message.id, message.title,message.content, message.created_at, message.updated_at, message.is_active, user.firstName, user.lastName',
        );

      if (userId) {
        // Dynamically filter messages by userid
        queryBuilder.andWhere('user.id = :userId', { userId });
      }
      return queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error getting all messages:', error);
      return null;
    }
  }
}
