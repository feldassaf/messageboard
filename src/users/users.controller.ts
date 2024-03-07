import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagesService } from '../messages/messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  @ApiOperation({
    summary: 'Get all messages which the authorized user authored',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async findUserMessagesWithVoteCount(@Request() req) {
    return this.messagesService.findAllWithVoteCounts(req.user.userId);
  }
}
