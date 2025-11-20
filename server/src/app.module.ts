import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextAgentModule } from './text-agent/text-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TextAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
