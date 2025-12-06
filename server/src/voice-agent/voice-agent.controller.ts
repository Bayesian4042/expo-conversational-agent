import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { VoiceAgentService } from './voice-agent.service';
import { GenerateSpeechDto } from './dto/generate-speech.dto';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

@Controller('voice-agent')
export class VoiceAgentController {
  constructor(private readonly voiceAgentService: VoiceAgentService) {}

  @Post('generate-speech')
  @HttpCode(HttpStatus.OK)
  async generateSpeech(
    @Body() body: GenerateSpeechDto,
  ): Promise<{ audio: string; format: string }> {
    const voice = body.voice || 'alloy';
    const audioBuffer = await this.voiceAgentService.generateSpeech(
      body.text,
      voice,
    );

    return {
      audio: audioBuffer.toString('base64'),
      format: 'mp3',
    };
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async voiceChat(
    @Body() body: { message: string; patientId: string; clinicId: string },
  ): Promise<{ text: string; audio: string; format: string }> {
    console.log('Voice chat request:', body);
    const { message } = body;

    if (!message || message.trim().length === 0) {
      throw new BadRequestException('Message is required');
    }

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are a helpful AI assistant.`,
      prompt: message,
    });

    console.log('Generated text:', text);

    const audioBuffer = await this.voiceAgentService.generateSpeech(
      text,
      'alloy',
    );

    console.log('Generated speech');

    return {
      text,
      audio: audioBuffer.toString('base64'),
      format: 'mp3',
    };
  }
}
