import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { VotesService } from '../votes/votes.service';
import { Vote } from '../votes/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Vote])],
  controllers: [MessagesController],
  providers: [MessagesService, VotesService],
  exports: [MessagesService],
})
export class MessagesModule {}
