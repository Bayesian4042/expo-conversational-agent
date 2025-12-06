import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/logger/logger.service';
import { openai } from '@ai-sdk/openai';
import type { Response } from 'express';
import {
  convertToModelMessages,
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai';
import { ChatRequestDto } from './dto/chat-request.dto';

@Injectable()
export class TextAgentService {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('TextAgentService');
  }

  streamChatResponse(body: ChatRequestDto, response: Response): void {
    const { messages } = body;

    let systemPrompt: string;

    try {
      systemPrompt = `You are a helpful AI assistant.`;
    } catch (error) {
      console.error('Error getting context:', error);
      systemPrompt = 'You are a helpful AI assistant.';
    }
    pipeUIMessageStreamToResponse({
      response: response,
      stream: createUIMessageStream({
        execute: ({ writer }) => {
          const result = streamText({
            model: openai('gpt-4.1'),
            messages: convertToModelMessages(messages),
            system: systemPrompt,
            experimental_transform: smoothStream({ chunking: 'word' }),
            onStepFinish: ({ finishReason }) => {
              console.log(`Step finished: ${finishReason}`);
            },
            onError: (error: unknown) => {
              console.error('Stream text error:', error);
            },
            stopWhen: stepCountIs(20),
          });

          writer.merge(result.toUIMessageStream());
        },
        onError: (error: unknown) => {
          console.error('UI message stream error:', error);
          return 'An error occurred while processing your message';
        },
      }),
    });
  }
}
