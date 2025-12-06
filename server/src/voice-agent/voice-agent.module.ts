import { Module } from '@nestjs/common';
import { VoiceAgentController } from './voice-agent.controller';
import { VoiceAgentService } from './voice-agent.service';
import { TextAgentModule } from '../text-agent/text-agent.module';
import { TextAgentService } from '../text-agent/text-agent.service';
import { CustomLoggerService } from '../logger/logger.service';

@Module({
  imports: [TextAgentModule],
  controllers: [VoiceAgentController],
  providers: [VoiceAgentService, TextAgentService, CustomLoggerService],
  exports: [VoiceAgentService],
})
export class VoiceAgentModule {}
