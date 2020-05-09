import { Module } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { ListensModule } from "src/listens/listens.module";

@Module({
  imports: [ListensModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
