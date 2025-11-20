import { Test, TestingModule } from '@nestjs/testing';
import { TextAgentController } from './text-agent.controller';
import { TextAgentService } from './text-agent.service';

describe('TextAgentController', () => {
  let controller: TextAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextAgentController],
      providers: [TextAgentService],
    }).compile();

    controller = module.get<TextAgentController>(TextAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
