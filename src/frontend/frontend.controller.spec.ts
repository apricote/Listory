import { Test, TestingModule } from '@nestjs/testing';
import { FrontendController } from './frontend.controller';

describe('Frontend Controller', () => {
  let controller: FrontendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrontendController],
    }).compile();

    controller = module.get<FrontendController>(FrontendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
