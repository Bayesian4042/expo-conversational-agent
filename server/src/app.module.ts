import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextAgentModule } from './text-agent/text-agent.module';
import { VoiceAgentModule } from './voice-agent/voice-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TextAgentModule,
    VoiceAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
