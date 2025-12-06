import { Module } from '@nestjs/common';
import { TextAgentService } from './text-agent.service';
import { TextAgentController } from './text-agent.controller';
import { CustomLoggerService } from '../logger/logger.service';

@Module({
  controllers: [TextAgentController],
  providers: [TextAgentService, CustomLoggerService],
})
export class TextAgentModule {}
