import { Module } from '@nestjs/common';
import { FrontendController } from './frontend.controller';

@Module({
  controllers: [FrontendController]
})
export class FrontendModule {}
