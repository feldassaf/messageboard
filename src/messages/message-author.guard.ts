import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Injectable()
export class MessageAuthorGuard implements CanActivate {
  constructor(private readonly messagesService: MessagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const messageId = +request.params.messageId;
    const userId = request.user.userId;

    const isMessageAuthor = await this.messagesService.isMessageAuthor(
      messageId,
      userId,
    );

    // Check if the message was authored by the user
    if (!isMessageAuthor) {
      this.setCustomErrorResponse(context);
      return false;
    }
    return true;
  }

  private setCustomErrorResponse(context: ExecutionContext): void {
    // Custom message for this guard
    const response = context.switchToHttp().getResponse();
    response.status(403).json({
      error: 'Forbidden',
      message: 'You are not the author of this message',
      statusCode: 403,
    });
  }
}
