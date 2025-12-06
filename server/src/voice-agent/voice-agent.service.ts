import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

@Injectable()
export class VoiceAgentService {
  constructor(private readonly configService: ConfigService) {}

  async generateSpeech(
    text: string,
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy',
  ): Promise<Buffer> {
    const result = await generateSpeech({
      model: openai.speech('gpt-4o-mini-tts'),
      text: text,
      voice: voice,
    });

    return Buffer.from(result.audio.uint8Array);
  }
}
