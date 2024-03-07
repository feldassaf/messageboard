import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { MessagesService } from '../messages/messages.service';
import { Message } from '../messages/entities/message.entity';
import { Vote } from '../votes/entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message, Vote])],
  controllers: [UsersController],
  providers: [UsersService, MessagesService],
  exports: [UsersService],
})
export class UsersModule {}
