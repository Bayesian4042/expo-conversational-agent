import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TextAgentService } from './text-agent.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@Controller('text-agent')
export class TextAgentController {
  constructor(private readonly textAgentService: TextAgentService) {}

  @Post('/')
  async streamData(@Res() response: Response, @Body() body: ChatRequestDto) {
    console.log('Received request body:', JSON.stringify(body, null, 2));
    this.textAgentService.streamChatResponse(body, response);
  }
}
