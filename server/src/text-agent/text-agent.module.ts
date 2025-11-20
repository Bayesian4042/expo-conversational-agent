import { Module } from '@nestjs/common';
import { TextAgentService } from './text-agent.service';
import { TextAgentController } from './text-agent.controller';

@Module({
  controllers: [TextAgentController],
  providers: [TextAgentService],
})
export class TextAgentModule {}
