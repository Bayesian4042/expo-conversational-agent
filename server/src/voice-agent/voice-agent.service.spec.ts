import { Test, TestingModule } from '@nestjs/testing';
import { VoiceAgentService } from './voice-agent.service';
import { ConfigService } from '@nestjs/config';

describe('VoiceAgentService', () => {
  let service: VoiceAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceAgentService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VoiceAgentService>(VoiceAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
