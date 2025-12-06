import { Test, TestingModule } from '@nestjs/testing';
import { VoiceAgentController } from './voice-agent.controller';
import { VoiceAgentService } from './voice-agent.service';
import { TextAgentService } from '../text-agent/text-agent.service';

describe('VoiceAgentController', () => {
  let controller: VoiceAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceAgentController],
      providers: [
        {
          provide: VoiceAgentService,
          useValue: {
            generateSpeech: jest.fn(),
          },
        },
        {
          provide: TextAgentService,
          useValue: {
            getContextForPatient: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VoiceAgentController>(VoiceAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
