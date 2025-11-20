import { Test, TestingModule } from '@nestjs/testing';
import { TextAgentService } from './text-agent.service';

describe('TextAgentService', () => {
  let service: TextAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextAgentService],
    }).compile();

    service = module.get<TextAgentService>(TextAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
