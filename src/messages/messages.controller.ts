import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { VotesService } from '../votes/votes.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVoteDto } from '../votes/dto/create-vote.dto';
import { MessageAuthorGuard } from './message-author.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly votesService: VotesService,
  ) {}

  @ApiOperation({ summary: 'Create a new message by an authorized user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(createMessageDto, req.user);
  }

  @ApiOperation({
    summary: 'Vote up or down for a message by an authorized user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':messageId/vote')
  async voteMessage(
    @Param('messageId') messageId: number,
    @Body() createVoteDto: CreateVoteDto,
    @Request() req,
  ) {
    const result = await this.votesService.create(
      messageId,
      createVoteDto,
      req.user,
    );

    return result;
  }

  @ApiOperation({
    summary: 'Delete a message by an authorized user which is the author',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, MessageAuthorGuard)
  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: number) {
    const result = await this.messagesService.delete(messageId);

    return result;
  }

  @ApiOperation({
    summary: 'Get all messages and votes count',
  })
  @Get()
  async findAllWithVoteCount() {
    return this.messagesService.findAllWithVoteCounts();
  }
}
